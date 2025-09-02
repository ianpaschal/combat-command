import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { getErrorMessage } from '../../common/errors';
import { getTournamentOrganizersByTournament } from '../../tournamentOrganizers';

export const deleteTournamentCompetitorArgs = v.object({
  id: v.id('tournamentCompetitors'),
});

/**
 * Deletes a tournament competitor.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.id - ID of the tournament competitor
 */
export const deleteTournamentCompetitor = async (
  ctx: MutationCtx,
  args: Infer<typeof deleteTournamentCompetitorArgs>,
): Promise<void> => {
  const { id } = args;
  // --- CHECK AUTH ----
  const userId = await checkAuth(ctx);
    
  // ---- VALIDATE ----
  const tournamentCompetitor = await ctx.db.get(id);
  if (!tournamentCompetitor) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_COMPETITOR_NOT_FOUND'));
  }
  const tournament = await ctx.db.get(tournamentCompetitor.tournamentId);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_CONTAINING_COMPETITOR_NOT_FOUND'));
  }
  if (tournament.status === 'archived') {
    throw new ConvexError(getErrorMessage('CANNOT_MODIFY_ARCHIVED_TOURNAMENT'));
  }

  // ---- EXTENDED AUTH CHECK ----
  /* These user IDs can make changes to this tournament competitor:
   * - Tournament organizers;
   * - This tournament competitor's captain;
   */
  const tournamentOrganizers = await getTournamentOrganizersByTournament(ctx, {
    tournamentId: tournamentCompetitor.tournamentId,
  });
  const authorizedUserIds = [
    ...tournamentOrganizers.map((r) => r.userId),
    tournamentCompetitor.captainUserId,
  ];
  if (!authorizedUserIds.includes(userId)) {
    throw new ConvexError(getErrorMessage('USER_DOES_NOT_HAVE_PERMISSION'));
  }

  // ---- PRIMARY ACTIONS ----
  await ctx.db.delete(id);

  // Also delete the corresponding competitor:
  const teamTournamentRegistrations = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_tournament_competitor', (q) => q.eq('tournamentCompetitorId', id))
    .collect();
  for (const registration of teamTournamentRegistrations) {
    await ctx.db.delete(registration._id);
  }
};
