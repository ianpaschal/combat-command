import { Infer, v } from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { checkUserAuth } from '../_helpers/checkUserAuth';
import { getShallowUser } from '../_helpers/getShallowUser';

export const updateUserArgs = v.object({
  id: v.id('users'),
  avatarStorageId: v.id('_storage'),
});

/**
 * Updates a user's avatar.
 * 
 * @param ctx - Convex query context
 * @param args
 */
export const updateUser = async (
  ctx: MutationCtx,
  args: Infer<typeof updateUserArgs>,
): Promise<void> => {
  const { id, ...updated } = args;
  const user = await getShallowUser(ctx, id);
    
  // --- CHECK AUTH ----
  checkUserAuth(ctx, user);

  // ---- PRIMARY ACTIONS ----
  await ctx.db.patch(id, {
    ...updated,
    modifiedAt: Date.now(),
  });
};
