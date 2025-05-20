import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { getTournamentStrict } from './_helpers/getTournamentStrict';
import { MutationCtx } from '../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { getTournamentTimer } from './helpers';

export const startTournamentTimerArgs = v.object({
  id: v.id('tournaments'),
});

export const startTournamentTimer = async (
  ctx: MutationCtx,
  { id }: Infer<typeof startTournamentTimerArgs>,
) => {
  const tournament = await getTournamentStrict(ctx, id);
  if (tournament.status !== 'active' || tournament.currentRound === undefined) {
    throw new ConvexError(getErrorMessage('INACTIVE_TOURNAMENT_CANNOT_USE_TIMERS'));
  }
  const timer = await ctx.db.query('tournamentTimers')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', id))
    .filter((q) => q.eq(q.field('round'), tournament.currentRound))
    .first();
  if (timer) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_TIMER_ALREADY_EXISTS'));
  }
  await ctx.db.insert('tournamentTimers', {
    tournamentId: id,
    round: tournament.currentRound,
    startedAt: Date.now(),
    pausedAt: null,
    pauseTime: 0,
  });
};

export const pauseTournamentTimerArgs = v.object({
  id: v.id('tournaments'),
});

export const pauseTournamentTimer = async (
  ctx: MutationCtx,
  { id }: Infer<typeof pauseTournamentTimerArgs>,
) => {
  const timer = await getTournamentTimer(ctx, id);
  if (timer.pausedAt) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_TIMER_ALREADY_PAUSED'));
  }
  await ctx.db.patch(timer._id, {
    pausedAt: Date.now(),
  });
};

export const resumeTournamentTimerArgs = v.object({
  id: v.id('tournaments'),
});

export const resumeTournamentTimer = async (
  ctx: MutationCtx,
  { id }: Infer<typeof resumeTournamentTimerArgs>,
) => {
  const timer = await getTournamentTimer(ctx, id);
  if (!timer.pausedAt) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_TIMER_ALREADY_RUNNING'));
  }
  await ctx.db.patch(timer._id, {
    pausedAt: null,
    pauseTime: timer.pauseTime + (Date.now() - timer.pausedAt),
  });
};

export const resetTournamentTimerArgs = v.object({
  id: v.id('tournaments'),
});

export const resetTournamentTimer = async (
  ctx: MutationCtx,
  { id }: Infer<typeof resetTournamentTimerArgs>,
) => {
  const timer = await getTournamentTimer(ctx, id);
  await ctx.db.patch(timer._id, {
    pausedAt: null,
    pauseTime: 0,
    startedAt: Date.now(),
  });
};
