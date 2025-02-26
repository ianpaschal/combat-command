import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';

import { mutation } from '../_generated/server';

export const confirmFriendship = mutation({
  args: {
    id: v.id('friendships'),
  },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    const friendship = await ctx.db.get(id);

    if (userId !== friendship?.recipientUserId) {
      throw 'Cannot confirm friendship you are not the recipient of.';
    }

    await ctx.db.patch(id, {
      confirmedAt: Date.now(),
    });
  },
});
