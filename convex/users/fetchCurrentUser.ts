import { getAuthUserId } from '@convex-dev/auth/server';

import { query } from '../_generated/server';

export const fetchCurrentUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }
    return {
      ...user,
      avatarUrl: user.avatarStorageId ? await ctx.storage.getUrl(user.avatarStorageId) : undefined,
    };
  },
});
