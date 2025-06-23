import { Infer, v } from 'convex/values';

import { MutationCtx } from '../../../_generated/server';

export const updateUserAvatarNoAuthArgs = v.object({
  userId: v.id('users'),
  avatarStorageId: v.id('_storage'),
});

export const updateUserAvatarNoAuth = async (
  ctx: MutationCtx,
  args: Infer<typeof updateUserAvatarNoAuthArgs>,
): Promise<void> => {
  const user = await ctx.db.get(args.userId);
  if (!user) {
    throw 'Could not find a user by that ID.';
  }
  await ctx.db.patch(args.userId, {
    avatarStorageId: args.avatarStorageId,
  });
};
