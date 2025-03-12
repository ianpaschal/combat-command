import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';

import { mutation } from '../_generated/server';
import { userFields } from './fields';

export const updateUser = mutation({
  args: {
    ...userFields,
    id: v.id('users'),
  },
  handler: async (ctx, { id, ...args }) => {
    const queryingUserId = await getAuthUserId(ctx);
    if (id !== queryingUserId) {
      throw 'Cannot modify another user\'s profile!';
    }
    await ctx.db.patch(id, {
      ...args,
      modifiedAt: Date.now(),
    });
  },
});
