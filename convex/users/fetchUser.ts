import { v } from 'convex/values';

import { getLimitedUser } from './utils/getLimitedUser';
import { query } from '../_generated/server';

export const fetchUser = query({
  args: {
    id: v.id('users'),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (user) {
      return {
        ...await getLimitedUser(ctx, user),
        avatarUrl: user.avatarStorageId ? await ctx.storage.getUrl(user.avatarStorageId) : undefined,
      };
    }
    return user;
  },
});
