import { ConvexError } from 'convex/values';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { getUser } from '../../users/queries/getUser';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Deepens a match result comment by joining additional relevant data and adding computed fields.
 * 
 * @remarks
 * This method's return type is, by nature, the definition of a deep match result comment.
 * 
 * @param ctx - Convex query context
 * @param matchResultComment - Raw match result comment document
 * @returns A deep match result comment
 */
export const deepenMatchResultComment = async (
  ctx: QueryCtx,
  matchResultComment: Doc<'matchResultComments'>,
) => {
  const user = await getUser(ctx, { id: matchResultComment.userId });
  if (!user) {
    throw new ConvexError(getErrorMessage('USER_NOT_FOUND'));
  }
  return {
    ...matchResultComment,
    user,
  };
};

/**
 * Match result comment with additional joined data and computed fields.
 */
export type DeepMatchResultComment = Awaited<ReturnType<typeof deepenMatchResultComment>>;
