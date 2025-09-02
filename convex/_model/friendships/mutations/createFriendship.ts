import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { Id } from '../../../_generated/dataModel';
import { MutationCtx } from '../../../_generated/server';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { getErrorMessage } from '../../common/errors';
import { editableFields } from '../table';

export const createFriendshipArgs = v.object({
  ...editableFields,
});

export const createFriendship = async (
  ctx: MutationCtx,
  args: Infer<typeof createFriendshipArgs>,
): Promise<Id<'friendships'>> => {
  // ---- CHECK AUTH ----
  const userId = await checkAuth(ctx);

  // ---- VALIDATE ----
  if (userId !== args.senderUserId) {
    throw new ConvexError(getErrorMessage('CANNOT_REQUEST_FRIENDSHIP_AS_OTHER_USER'));
  }

  if (args.senderUserId === args.recipientUserId) {
    throw new ConvexError(getErrorMessage('CANNOT_CREATE_CIRCULAR_FRIENDSHIP'));
  }

  // ---- PRIMARY ACTIONS ----
  return await ctx.db.insert('friendships', args);
};
