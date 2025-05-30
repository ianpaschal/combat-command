import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { getTournamentTimerStrict } from './_helpers/getTournamentTimerStrict';
import { MutationCtx } from '../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { getTournamentTimer } from './helpers';

export const startTournamentTimerArgs = v.object({
  tournamentId: v.id('tournaments'),
});

export const startTournamentTimer = async (
  ctx: MutationCtx,
  args: Infer<typeof startTournamentTimerArgs>,
) => {
  const timer = await getTournamentTimerStrict(ctx, args.tournamentId);
  if (!timer.startedAt) {
    return await ctx.db.patch(timer._id, {
      startedAt: Date.now(),
    });
  }
  if (timer.pausedAt) {
    return await ctx.db.patch(timer._id, {
      pausedAt: null,
      pauseTime: timer.pauseTime + (Date.now() - timer.pausedAt),
    });
  }
};

export const pauseTournamentTimerArgs = v.object({
  tournamentId: v.id('tournaments'),
});

export const pauseTournamentTimer = async (
  ctx: MutationCtx,
  args: Infer<typeof pauseTournamentTimerArgs>,
) => {
  const timer = await getTournamentTimer(ctx, args.tournamentId);
  if (timer.pausedAt) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_TIMER_ALREADY_PAUSED'));
  }
  await ctx.db.patch(timer._id, {
    pausedAt: Date.now(),
  });
};

export const resetTournamentTimerArgs = v.object({
  tournamentId: v.id('tournaments'),
});

export const resetTournamentTimer = async (
  ctx: MutationCtx,
  args: Infer<typeof resetTournamentTimerArgs>,
) => {
  const timer = await getTournamentTimer(ctx, args.tournamentId);
  await ctx.db.patch(timer._id, {
    pausedAt: null,
    pauseTime: 0,
    startedAt: Date.now(),
  });
};
