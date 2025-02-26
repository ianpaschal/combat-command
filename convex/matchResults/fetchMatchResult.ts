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
    const player0User = await ctx.db.get(matchResult.player0UserId);
    const player1User = matchResult?.player1UserId ? await ctx.db.get(matchResult?.player1UserId) : null;
    return {
      ...matchResult,
      player0user: player0User ? await getLimitedUser(ctx, player0User) : null,
      player1user: player1User ? await getLimitedUser(ctx, player1User) : null,
    };
  },
});
