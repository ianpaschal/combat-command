import { Infer, v } from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getTournamentTimerShallow } from '../_helpers/getTournamentTimerShallow';

export const toggleTournamentTimerArgs = v.object({
  id: v.id('tournamentTimers'),
});

/**
 * 
 * @param ctx 
 * @param args 
 * @returns A boolean representing whether the TournamentTimer is paused
 */
export const toggleTournamentTimer = async (
  ctx: MutationCtx,
  args: Infer<typeof toggleTournamentTimerArgs>,
): Promise<boolean> => {
  const timer = await getTournamentTimerShallow(ctx, args.id);

  // Resume (and start if not started):
  if (timer.pausedAt) {
    await ctx.db.patch(timer._id, {
      pausedAt: null,
      startedAt: timer.startedAt ?? Date.now(),
      pauseTime: timer.pauseTime + (Date.now() - timer.pausedAt),
    });
    return false;
  }

  // Pause:
  await ctx.db.patch(timer._id, {
    pausedAt: Date.now(),
  });
  return true;
};
