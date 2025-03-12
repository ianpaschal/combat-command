import { v } from 'convex/values';

import { query } from '../_generated/server';

export const fetchFriendshipUserIdsByUserId = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, { userId }) => {
    
    const initiatedFriendships = await ctx.db.query('friendships')
      .withIndex('by_sender_user_id', (q) => q.eq('senderUserId', userId).lte('confirmedAt', Date.now()))
      .collect();

    const initiatedFriendshipUserIds = initiatedFriendships.map((f) => f.recipientUserId);
    
    const acceptedFriendships = await ctx.db.query('friendships')
      .withIndex('by_recipient_user_id', (q) => q.eq('recipientUserId', userId).lte('confirmedAt', Date.now()))
      .collect();

    const acceptedFriendshipUserIds = acceptedFriendships.map((f) => f.senderUserId);

    return [
      ...initiatedFriendshipUserIds,
      ...acceptedFriendshipUserIds,
    ];
  },
});
