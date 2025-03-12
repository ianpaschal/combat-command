import { v } from 'convex/values';

import { query } from '../_generated/server';

export const fetchFriendship = query({
  args: {
    id: v.id('friendships'),
  },
  handler: async (ctx, args) => await ctx.db.get(args.id),
});
