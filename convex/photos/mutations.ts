import { getAuthUserId } from '@convex-dev/auth/server';

import { mutation } from '../_generated/server';
import { fields } from '.';

export const addPhoto = mutation({
  args: {
    ...fields,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw 'Cannot add photo while unauthenticated.';
    }
    return await ctx.db.insert('photos', {
      ...args,
      ownerUserId: userId,
    });
  },
});
