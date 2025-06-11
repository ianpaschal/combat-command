import { Infer, v } from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getTournamentTimerShallow } from '../_helpers/getTournamentTimerShallow';

export const resetTournamentTimerArgs = v.object({
  id: v.id('tournamentTimers'),
});

export const resetTournamentTimer = async (
  ctx: MutationCtx,
  args: Infer<typeof resetTournamentTimerArgs>,
): Promise<void> => {
  const timer = await getTournamentTimerShallow(ctx, args.id);
  await ctx.db.patch(timer._id, {
    pausedAt: null,
    pauseTime: 0,
    startedAt: Date.now(),
  });
};
