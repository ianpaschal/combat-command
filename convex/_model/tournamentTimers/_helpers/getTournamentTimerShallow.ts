import { ConvexError } from 'convex/values';

import { Doc, Id } from '../../../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../common/errors';

/**
 * Gets a TournamentTimer from the database without joining any additional data (shallow).
 * 
 * @remarks
 * This method should be used when you KNOW a TournamentTimer exists.
 * This is almost always the case.
 * If the document does not exist in the database, this function will throw an error.
 * 
 * @param ctx - Convex query context
 * @param id - ID of the TournamentTimer
 * @returns A raw TournamentTimer document
 */
export const getTournamentTimerShallow = async (
  ctx: QueryCtx | MutationCtx,
  id: Id<'tournamentTimers'>,
): Promise<Doc<'tournamentTimers'>> => {
  const timer = await ctx.db.get(id);
  if (!timer) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_TIMER_NOT_FOUND'));
  }
  return timer;
};
