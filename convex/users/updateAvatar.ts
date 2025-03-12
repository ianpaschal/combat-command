import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';

import { mutation } from '../_generated/server';

export const updateAvatar = mutation({
  args: {
    userId: v.id('users'),
    avatarStorageId: v.id('_storage'),
  },
  handler: async (ctx, { userId, avatarStorageId }) => {
    const queryingUserId = await getAuthUserId(ctx);
    
    if (userId !== queryingUserId) {
      throw 'Cannot modify another user\'s avatar.';
    }

    const user = await ctx.db.get(userId);

    if (!user) {
      throw 'Could not find a user by that ID.';
    }

    const existingAvatarStorageId = user?.avatarStorageId;
    
    // Add the new storage ID to the user
    await ctx.db.patch(userId, {
      avatarStorageId,
      modifiedAt: Date.now(),
    });

    // Delete the old file to clean-up
    if (existingAvatarStorageId) {
      await ctx.storage.delete(existingAvatarStorageId);
    }
  },
});
