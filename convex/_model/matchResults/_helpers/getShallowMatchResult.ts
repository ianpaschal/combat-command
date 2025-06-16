import { ConvexError } from 'convex/values';

import { Doc, Id } from '../../../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';

/**
 * Gets a match result from the database without joining any additional data (shallow).
 * 
 * @remarks
 * This method should be used when you KNOW a match result exists.
 * This is almost always the case.
 * If the document does not exist in the database, this function will throw an error.
 * 
 * @throws If the match result does not exist.
 * 
 * @param ctx - Convex query context
 * @param id - ID of the match result
 * @returns A raw match result document
 */
export const getShallowMatchResult = async (
  ctx: QueryCtx | MutationCtx,
  id: Id<'matchResults'>,
): Promise<Doc<'matchResults'>> => {
  const matchResult = await ctx.db.get(id);
  if (!matchResult) {
    throw new ConvexError(getErrorMessage('MATCH_RESULT_NOT_FOUND'));
  }
  return matchResult;
};
