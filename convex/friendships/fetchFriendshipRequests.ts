import { getAuthUserId } from '@convex-dev/auth/server';

import { query } from '../_generated/server';

export const fetchFriendshipRequests = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId) {
      return await ctx.db.query('friendships').withIndex('by_recipient_user_id', (q) => q.eq('recipientUserId', userId).eq('confirmedAt', undefined)).collect();
    }
  },
});
