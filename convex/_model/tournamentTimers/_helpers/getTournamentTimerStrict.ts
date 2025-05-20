import { ConvexError } from 'convex/values';

import { Id } from '../../../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { getTournamentStrict } from './getTournamentStrict';

/**
 * Gets a tournament timer document which must exist.
 * An error will be thrown if it does not exist.
 * An error will also be thrown if the tournament is not active or does not have a current round, as such a tournament cannot have a running timer.
 * 
 * @param ctx 
 * @param tournamentId 
 * @returns 
 */
export const getTournamentTimerStrict = async (
  ctx: QueryCtx | MutationCtx,
  tournamentId: Id<'tournaments'>,
) => {
  const tournament = await getTournamentStrict(ctx, tournamentId);
  if (tournament.status !== 'active' || tournament.currentRound === undefined) {
    throw new ConvexError(getErrorMessage('INACTIVE_TOURNAMENT_CANNOT_USE_TIMERS'));
  }
  const timer = await ctx.db.query('tournamentTimers')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', tournamentId))
    .filter((q) => q.eq(q.field('round'), tournament.currentRound))
    .first();
  if (!timer) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_TIMER_NOT_FOUND'));
  }
  return timer;
};
