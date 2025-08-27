import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { getErrorMessage } from '../../common/errors';

export const confirmFriendshipArgs = v.object({
  id: v.id('friendships'),
});

export const confirmFriendship = async (
  ctx: MutationCtx,
  args: Infer<typeof confirmFriendshipArgs>,
): Promise<void> => {
  // ---- CHECK AUTH ----
  const userId = await checkAuth(ctx);

  // ---- VALIDATE ----
  const friendship = await ctx.db.get(args.id);
  if (!friendship) {
    throw new ConvexError(getErrorMessage('FRIENDSHIP_NOT_FOUND'));
  }
  if (userId !== friendship.recipientUserId) {
    throw new ConvexError(getErrorMessage('USER_DOES_NOT_HAVE_PERMISSION'));
  }

  // ---- PRIMARY ACTIONS ----
  return await ctx.db.patch(args.id, {
    confirmedAt: Date.now(),
  });
};
