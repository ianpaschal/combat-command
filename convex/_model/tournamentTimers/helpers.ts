import { ConvexError } from 'convex/values';

import { Id } from '../../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../../_generated/server';
import { getErrorMessage } from '../../common/errors';

export const getTournamentTimer = async (
  ctx: QueryCtx | MutationCtx,
  tournamentId: Id<'tournaments'>,
) => {
  const tournament = await ctx.db.get(tournamentId);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }
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
