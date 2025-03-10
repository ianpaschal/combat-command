import { v } from 'convex/values';

import { query } from '../_generated/server';
import { getLimitedUser } from '../users/utils/getLimitedUser';

export const fetchMatchResult = query({
  args: {
    id: v.id('matchResults'),
  },
  handler: async (ctx, args) => {
    const matchResult = await ctx.db.get(args.id);
    if (!matchResult) {
      return null;
    }
    return {
      ...matchResult,
      player0user: await getLimitedUser(ctx, matchResult?.player0UserId),
      player1user: await getLimitedUser(ctx, matchResult?.player1UserId),
    };
  },
});
