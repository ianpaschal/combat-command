import { Infer, v } from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { checkUserAuth } from '../_helpers/checkUserAuth';
import { getShallowUser } from '../_helpers/getShallowUser';

export const updateUserAvatarArgs = v.object({
  id: v.id('users'),
  avatarStorageId: v.id('_storage'),
});

export const updateUserAvatar = async (
  ctx: MutationCtx,
  args: Infer<typeof updateUserAvatarArgs>,
): Promise<void> => {
  const { id, avatarStorageId } = args;
  const user = await getShallowUser(ctx, id);
    
  // --- CHECK AUTH ----
  checkUserAuth(ctx, user);

  // ---- PRIMARY ACTIONS ----
  await ctx.db.patch(id, {
    avatarStorageId,
    modifiedAt: Date.now(),
  });
};
