import { Infer, v } from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { checkUserAuth } from '../_helpers/checkUserAuth';
import { getShallowUser } from '../_helpers/getShallowUser';
import { editableFields } from '../fields';

export const updateUserArgs = v.object({
  id: v.id('users'),
  ...editableFields,
});

/**
 * Updates a user.
 * 
 * @param ctx - Convex query context
 * @param args - User data
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
