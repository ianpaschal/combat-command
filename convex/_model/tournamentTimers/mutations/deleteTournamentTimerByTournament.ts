import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';

export const deleteTournamentTimerByTournamentArgs = v.object({
  round: v.optional(v.number()),
  tournamentId: v.id('tournaments'),
});

export const deleteTournamentTimerByTournament = async (
  ctx: MutationCtx,
  args: Infer<typeof deleteTournamentTimerByTournamentArgs>,
): Promise<void> => {
  const timer = await ctx.db.query('tournamentTimers')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', args.tournamentId))
    .filter((q) => q.eq(q.field('round'), args.round))
    .first();
  if (!timer) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_TIMER_NOT_FOUND'));
  }
  return await ctx.db.delete(timer._id);
};
