import { ConvexError } from 'convex/values';

import { Doc, Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';

/**
 * Gets a user from the database without joining any additional data (shallow).
 * 
 * @remarks
 * This method should be used when you KNOW a user exists.
 * This is almost always the case.
 * If the document does not exist in the database, this function will throw an error.
 * 
 * @param ctx - Convex query context
 * @param id - ID of the user
 * @returns A raw user document
 */
export const getShallowUser = async (
  ctx: QueryCtx,
  id: Id<'users'>,
): Promise<Doc<'users'>> => {
  const user = await ctx.db.get(id);
  if (!user) {
    throw new ConvexError(getErrorMessage('USER_NOT_FOUND'));
  }
  return user;
};
