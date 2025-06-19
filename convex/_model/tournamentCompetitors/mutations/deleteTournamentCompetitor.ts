import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { checkAuth } from '../../common/_helpers/checkAuth';

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
   */
  const authorizedUserIds = [
    ...tournament.organizerUserIds,
  ];
  if (!authorizedUserIds.includes(userId)) {
    throw new ConvexError(getErrorMessage('USER_DOES_NOT_HAVE_PERMISSION'));
  }

  // ---- PRIMARY ACTIONS ----
  await ctx.db.delete(id);
};
