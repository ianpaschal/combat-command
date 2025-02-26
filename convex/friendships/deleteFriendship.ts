import { v } from 'convex/values';

import { mutation } from '../_generated/server';

export const deleteFriendship = mutation({
  args: {
    id: v.id('friendships'),
  },
  handler: async (ctx, args) => await ctx.db.delete(args.id),
});
