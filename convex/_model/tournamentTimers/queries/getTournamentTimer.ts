import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenTournamentTimer, TournamentTimerDeep } from '../_helpers/deepenTournamentTimer';

export const getTournamentTimerArgs = v.object({
  id: v.id('tournamentTimers'),
});

/**
 * Gets a TournamentTimer by ID.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.id - ID of the TournamentTimer
 * @returns A deep TournamentTimer if found, otherwise null
 */
export const getTournamentTimer = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentTimerArgs>,
): Promise<TournamentTimerDeep | null> => {
  const timer = await ctx.db.get(args.id);
  if (!timer) {
    return null;
  }
  return await deepenTournamentTimer(ctx, timer);
};
