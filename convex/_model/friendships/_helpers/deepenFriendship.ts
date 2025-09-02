import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { getUser } from '../../users/queries/getUser';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const deepenFriendship = async (
  ctx: QueryCtx,
  friendship: Doc<'friendships'>,
) => {
  const userId = await getAuthUserId(ctx);
  const { senderUserId, recipientUserId, ...restFields } = friendship;
  const otherUserId = userId === senderUserId ? recipientUserId : senderUserId;
  const user = await getUser(ctx, { id: otherUserId });
  if (!user) {
    throw new ConvexError(getErrorMessage('USER_NOT_FOUND'));
  }
  return {
    ...restFields,
    user,
  };
};

/**
 * Friendship with additional joined data and computed fields.
 */
export type DeepFriendship = Awaited<ReturnType<typeof deepenFriendship>>;
