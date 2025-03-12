import { v } from 'convex/values';

import { query } from '../_generated/server';

export const checkUsernameExists = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.query('users').withIndex('by_username', (q) => q.eq('username', args.username)).first();
    return Boolean(user);
  },
});
