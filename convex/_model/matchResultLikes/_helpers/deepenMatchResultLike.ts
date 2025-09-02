import { ConvexError } from 'convex/values';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { getUser } from '../../users/queries/getUser';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Deepens a match result like by joining additional relevant data and adding computed fields.
 * 
 * @remarks
 * This method's return type is, by nature, the definition of a deep match result like.
 * 
 * @param ctx - Convex query context
 * @param matchResultLike - Raw match result like document
 * @returns A deep match result like
 */
export const deepenMatchResultLike = async (
  ctx: QueryCtx,
  matchResultLike: Doc<'matchResultLikes'>,
) => {
  const user = await getUser(ctx, { id: matchResultLike.userId });
  if (!user) {
    throw new ConvexError(getErrorMessage('USER_NOT_FOUND'));
  }
  return {
    ...matchResultLike,
    user,
  };
};

/**
 * Match result like with additional joined data and computed fields.
 */
export type DeepMatchResultLike = Awaited<ReturnType<typeof deepenMatchResultLike>>;
