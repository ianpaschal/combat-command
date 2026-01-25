import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { getErrorMessage } from '../../common/errors';
import { MutationResponse } from '../../common/types';
import { VisibilityLevel } from '../../common/VisibilityLevel';
import { getTournamentOrganizersByTournament } from '../../tournamentOrganizers';
import { checkUserIsRegistered } from '../_helpers/checkUserIsRegistered';
import { getCreateSuccessMessage } from '../_helpers/getCreateSuccessMessage';
import { editableFields } from '../table';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { tournamentCompetitorId, ...restEditableFields } = editableFields;

export const createTournamentRegistrationArgs = v.object({
  ...restEditableFields,
  tournamentCompetitorId: v.optional(v.id('tournamentCompetitors')),
  tournamentCompetitor: v.optional(v.object({
    teamName: v.optional(v.string()),
  })),
  nameVisibilityConsent: v.optional(v.boolean()),
});

export const createTournamentRegistration = async (
  ctx: MutationCtx,
  args: Infer<typeof createTournamentRegistrationArgs>,
): Promise<MutationResponse> => {
  // --- CHECK AUTH ----
  /* These user IDs can make changes to this tournament registration:
   * - Tournament organizers;
   * - The user themselves;
   */
  const currentUserId = await checkAuth(ctx);
  const currentUser = await ctx.db.get(currentUserId);
  const tournamentOrganizers = await getTournamentOrganizersByTournament(ctx, {
    tournamentId: args.tournamentId,
  });
  const authorizedUserIds = [
    ...tournamentOrganizers.map((r) => r.userId),
    args.userId,
  ];
  if (!currentUser || !authorizedUserIds.includes(currentUserId)) {
    throw new ConvexError(getErrorMessage('USER_DOES_NOT_HAVE_PERMISSION'));
  }

  // ---- VALIDATE ----
  const user = await ctx.db.get(args.userId);
  if (!user) {
    throw new ConvexError(getErrorMessage('USER_NOT_FOUND'));
  }
  const tournament = await ctx.db.get(args.tournamentId);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }
  if (tournament.status === 'archived') {
    throw new ConvexError(getErrorMessage('CANNOT_MODIFY_ARCHIVED_TOURNAMENT'));
  }
  if (tournament.status === 'draft') {
    throw new ConvexError(getErrorMessage('CANNOT_REGISTER_FOR_DRAFT_TOURNAMENT'));
  }
  const isAlreadyRegistered = await checkUserIsRegistered(ctx, args.tournamentId, args.userId);
  if (isAlreadyRegistered) {
    throw new ConvexError(getErrorMessage('USER_ALREADY_IN_TOURNAMENT'));
  }
  if (!args.tournamentCompetitorId && !args.tournamentCompetitor?.teamName?.length && tournament.competitorSize > 1) {
    throw new ConvexError(getErrorMessage('CANNOT_CREATE_REGISTRATION_WITHOUT_COMPETITOR'));
  }
  if (args.tournamentCompetitorId && args.tournamentCompetitor?.teamName?.length) {
    throw new ConvexError(getErrorMessage('CANNOT_CREATE_REGISTRATION_WITH_COMPETITOR_NAME_ID'));
  }
  if (tournament.requireRealNames && currentUser.nameVisibility < VisibilityLevel.Tournaments && !args.nameVisibilityConsent) {
    throw new ConvexError(getErrorMessage('CANNOT_CREATE_REGISTRATION_WITHOUT_REAL_NAME'));
  }

  // ---- PRIMARY ACTIONS ----
  let tournamentCompetitorId = args.tournamentCompetitorId;

  // If creating a new competitor:
  if (!tournamentCompetitorId) {
    tournamentCompetitorId = await ctx.db.insert('tournamentCompetitors', {
      captainUserId: args.userId,
      teamName: args.tournamentCompetitor?.teamName,
      tournamentId: args.tournamentId,
    });
  }

  const teamTournamentRegistrations = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_tournament_competitor', (q) => q.eq('tournamentCompetitorId', tournamentCompetitorId))
    .collect();
  const activePlayerCount = teamTournamentRegistrations.filter((reg) => reg.active).length;

  const tournamentRegistrationId = await ctx.db.insert('tournamentRegistrations', {
    active: activePlayerCount < tournament.competitorSize,
    confirmed: args.userId === currentUserId,
    listApproved: false,
    tournamentCompetitorId,
    tournamentId: args.tournamentId,
    userId: args.userId,
    details: args.details,
  });

  // Update user's name visibility if consent given:
  const consentRequired = tournament.requireRealNames && user.nameVisibility < VisibilityLevel.Tournaments;
  const consentGranted = args.nameVisibilityConsent && currentUser._id === user._id;
  if (consentRequired && consentGranted) {
    await ctx.db.patch(args.userId, {
      nameVisibility: VisibilityLevel.Tournaments,
    });
  }

  const result = await ctx.db.get(tournamentRegistrationId);
  const message = await getCreateSuccessMessage(ctx, result!);
  return {
    success: {
      message,
    },
  };
};
