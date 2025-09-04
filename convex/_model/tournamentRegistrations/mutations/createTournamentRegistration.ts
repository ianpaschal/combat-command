import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { Id } from '../../../_generated/dataModel';
import { MutationCtx } from '../../../_generated/server';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { getErrorMessage } from '../../common/errors';
import { getTournamentOrganizersByTournament } from '../../tournamentOrganizers';
import { compareVisibilityLevels } from '../../users/_helpers/compareVisibilityLevels';
import { checkUserIsRegistered } from '../_helpers/checkUserIsRegistered';
import { editableFields } from '../table';

export const createTournamentRegistrationArgs = v.object({
  ...editableFields,
});

export const createTournamentRegistration = async (
  ctx: MutationCtx,
  args: Infer<typeof createTournamentRegistrationArgs>,
): Promise<Id<'tournamentRegistrations'>> => {
  // --- CHECK AUTH ----
  const userId = await checkAuth(ctx);

  // ---- VALIDATE ----
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

  // ---- EXTENDED AUTH CHECK ----
  /* These user IDs can make changes to this tournament registration:
   * - Tournament organizers;
   * - The user themselves;
   */
  const tournamentOrganizers = await getTournamentOrganizersByTournament(ctx, {
    tournamentId: tournament._id,
  });
  const authorizedUserIds = [
    ...tournamentOrganizers.map((r) => r.userId),
    args.userId,
  ];
  if (!authorizedUserIds.includes(userId)) {
    throw new ConvexError(getErrorMessage('USER_DOES_NOT_HAVE_PERMISSION'));
  }

  // ---- PRIMARY ACTIONS ----
  const teamTournamentRegistrations = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_tournament_competitor', (q) => q.eq('tournamentCompetitorId', args.tournamentCompetitorId))
    .collect();
  const activePlayerCount = teamTournamentRegistrations.filter((reg) => reg.active).length;
  const tournamentRegistrationId = await ctx.db.insert('tournamentRegistrations', {
    ...args,
    active: activePlayerCount < tournament.competitorSize,
    listApproved: false,
    confirmed: args.userId === userId,
  });

  // Force user's name visibility to match tournament requirement:
  if (tournament.requireRealNames) {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new ConvexError(getErrorMessage('USER_NOT_FOUND'));
    }
    const isSufficient = compareVisibilityLevels('tournaments', user.nameVisibility ?? 'hidden');
    if (!isSufficient && userId === args.userId) {
      await ctx.db.patch(args.userId, {
        nameVisibility: 'tournaments',
      });
    }
  }

  return tournamentRegistrationId;
};
