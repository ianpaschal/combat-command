import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenTournamentTimer, TournamentTimerDeep } from '../_helpers/deepenTournamentTimer';

export const getTournamentTimerByTournamentArgs = v.object({
  round: v.number(),
  tournamentId: v.id('tournaments'),
});

/**
 * Gets a TournamentTimer by Tournament ID and round.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.round - Round the Timer relates to
 * @param args.tournamentId - ID of the parent Tournament
 * @returns A deep TournamentTimer if found, otherwise null
 */
export const getTournamentTimerByTournament = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentTimerByTournamentArgs>,
): Promise<TournamentTimerDeep | null> => {
  const timer = await ctx.db.query('tournamentTimers')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', args.tournamentId))
    .filter((q) => q.eq(q.field('round'), args.round))
    .first();
  if (!timer) {
    return null;
  } 
  return await deepenTournamentTimer(ctx, timer);
};
