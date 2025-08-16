import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { Id } from '../../../_generated/dataModel';
import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { getTournamentOrganizersByTournament } from '../../tournamentOrganizers';
import { editableFields } from '../fields';

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
  const ownTournamentRegistrations = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_user', (q) => q.eq('userId', args.userId)) // Fewer results to check
    .collect();
  const alreadyRegistered = ownTournamentRegistrations.find((reg) => reg.tournamentId === args.tournamentId);
  if (alreadyRegistered) {
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
    ...tournamentOrganizers.map((r) => r.userId === userId),
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
    userConfirmed: args.userId === userId,
  });

  // FIXME: USe a required visibility level
  // if (registration && tournament.requireRealNames) {
  //   const user = await ctx.db.get(userId);
  //   if (['hidden', 'friends'].includes(user?.nameVisibility ?? 'hidden')) {
  //     await ctx.db.patch(userId, { nameVisibility: 'community' });
  //   }
  // }

  return tournamentRegistrationId;
};
