import { getAuthUserId } from '@convex-dev/auth/server';

import { getAvatarUrl } from './utils/getAvatarUrl';
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
    const avatarUrl = await getAvatarUrl(ctx, user.avatarStorageId);
    return {
      ...user,
      avatarUrl,
    };
  },
});
