import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { Id } from '../../../_generated/dataModel';
import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { editableFields } from '../fields';

export const createTournamentTimerArgs = v.object({
  ...editableFields,
});

/**
 * Creates a new Tournament Timer.
 * 
 * @throws If a Tournament Timer already exists for this Tournament and round.
 * 
 * @param ctx - Convex query context
 * @param args - Tournament Timer data
 * @returns ID of the newly created Tournament Timer
 */
export const createTournamentTimer = async (
  ctx: MutationCtx,
  args: Infer<typeof createTournamentTimerArgs>,
): Promise<Id<'tournamentTimers'>> => {
  // TODO: Check if timer already exists for that combination of Tournament and round:
  const timer = await ctx.db.query('tournamentTimers')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', args.tournamentId))
    .filter((q) => q.eq(q.field('round'), args.round))
    .first();
  if (timer) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_TIMER_ALREADY_EXISTS'));
  }
  return await ctx.db.insert('tournamentTimers', {
    ...args,
    pausedAt: Date.now(),
    pauseTime: 0,
    startedAt: null,
  });
};
