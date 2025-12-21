import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { getErrorMessage } from '../../common/errors';
import { getTournamentOrganizersByTournament } from '../../tournamentOrganizers';

export const deleteTournamentRegistrationArgs = v.object({
  id: v.id('tournamentRegistrations'),
  // newCaptainUserId: v.optional(v.id('users')), // TODO
});

export const deleteTournamentRegistration = async (
  ctx: MutationCtx,
  args: Infer<typeof deleteTournamentRegistrationArgs>,
): Promise<{ wasLast: boolean }> => {
  // --- CHECK AUTH ----
  const userId = await checkAuth(ctx);

  // ---- REQUIRED DATA ----
  const registration = await ctx.db.get(args.id);
  if (!registration) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_REGISTRATION_NOT_FOUND'));
  }
  const tournament = await ctx.db.get(registration.tournamentId);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }
  const tournamentCompetitor = await ctx.db.get(registration.tournamentCompetitorId);
  if (!tournamentCompetitor) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_COMPETITOR_NOT_FOUND'));
  }
  const tournamentRegistrations = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_tournament_competitor', (q) => q.eq('tournamentCompetitorId', registration.tournamentCompetitorId))
    .collect();
  const tournamentOrganizers = await getTournamentOrganizersByTournament(ctx, {
    tournamentId: registration.tournamentId,
  });
  const wasLast = tournamentRegistrations.length < 2;
  const wasCaptain = tournamentCompetitor?.captainUserId === userId;
 
  // ---- VALIDATE ----
  if (tournament.status === 'archived') {
    throw new ConvexError(getErrorMessage('CANNOT_MODIFY_ARCHIVED_TOURNAMENT'));
  }
  if (tournament.status === 'active') {
    throw new ConvexError(getErrorMessage('CANNOT_REMOVE_PLAYER_FROM_ACTIVE_TOURNAMENT'));
  }
  // TODO:
  // if (wasCaptain && !args.newCaptainUserId) {

  // }

  // ---- EXTENDED AUTH CHECK ----
  /* These user IDs can make changes to this tournament registration:
   * - Tournament organizers;
   * - The user themselves;
   */
  const authorizedUserIds = [
    ...tournamentOrganizers.map((r) => r.userId),
    registration.userId,
  ];
  if (!authorizedUserIds.includes(userId)) {
    throw new ConvexError(getErrorMessage('USER_DOES_NOT_HAVE_PERMISSION'));
  }

  // ---- PRIMARY ACTIONS ----
  // Delete the registration:
  await ctx.db.delete(registration._id);
  
  // If this was the last player, also delete the corresponding competitor:
  if (wasLast) {
    await ctx.db.delete(registration.tournamentCompetitorId);
  }

  // If this was the captain, set a new captain:
  if (!wasLast && wasCaptain) {
    await ctx.db.patch(registration.tournamentCompetitorId, {
      captainUserId: tournamentRegistrations[0].userId,
    });
  }
  return {
    wasLast,
  };
};
