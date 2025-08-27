import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { getErrorMessage } from '../../common/errors';
import { deepenFriendship, DeepFriendship } from '../_helpers/deepenFriendship';

export const getFriendshipArgs = v.object({
  id: v.id('friendships'),
});

export const getFriendship = async (
  ctx: QueryCtx,
  args: Infer<typeof getFriendshipArgs>,
): Promise<DeepFriendship | null> => {
  // ---- CHECK AUTH ----
  const userId = await checkAuth(ctx);
  
  // ---- VALIDATE ----
  const friendship = await ctx.db.get(args.id);
  if (!friendship) {
    return null;
  }
  if (userId !== friendship.senderUserId && userId !== friendship.recipientUserId) {
    throw new ConvexError(getErrorMessage('USER_DOES_NOT_HAVE_PERMISSION'));
  }
  
  return await deepenFriendship(ctx, friendship);
};
