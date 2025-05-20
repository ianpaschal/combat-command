import { ConvexError } from 'convex/values';

import { Id } from '../../../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';

/**
 * Gets a tournament document which must exist.
 * An error will be thrown if it does not exist.
 * 
 * @param ctx 
 * @param id 
 * @returns 
 */
export const getTournamentStrict = async (
  ctx: QueryCtx | MutationCtx,
  id: Id<'tournaments'>,
) => {
  const tournament = await ctx.db.get(id);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }
  return tournament;
};
