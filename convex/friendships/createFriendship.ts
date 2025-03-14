import { getAuthUserId } from '@convex-dev/auth/server';

import { mutation } from '../_generated/server';
import { fields } from '.';

export const createFriendship = mutation({
  args: {
    ...fields,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId !== args.senderUserId) {
      throw 'Cannot request a friendship as another user.';
    }

    if (userId === args.recipientUserId) {
      throw 'Cannot request a friendship with yourself.';
    }

    return await ctx.db.insert('friendships', args);
  },
});
