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
    if (timer.startedAt) {
      // Resume:
      await ctx.db.patch(timer._id, {
        pausedAt: null,
        pauseTime: timer.pauseTime + (Date.now() - timer.pausedAt),
      });
    } else {
      // Start:
      await ctx.db.patch(timer._id, {
        pausedAt: null,
        startedAt: Date.now(),
        pauseTime: 0,
      });
    }
    return false;
  }

  // Pause:
  await ctx.db.patch(timer._id, {
    pausedAt: Date.now(),
  });
  return true;
};
