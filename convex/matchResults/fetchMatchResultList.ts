import { query } from '../_generated/server';
import { getLimitedUser } from '../users/utils/getLimitedUser';

export const fetchMatchResultList = query({
  args: {},
  handler: async (ctx) => {
    const matchResults = await ctx.db.query('matchResults').collect();
    return Promise.all(matchResults.map(async (matchResult) => {
      const player0User = await getLimitedUser(ctx, matchResult?.player0UserId);
      const player1User = await getLimitedUser(ctx, matchResult?.player1UserId);
      return {
        ...matchResult,
        ...(player0User ? { player0User } : {}),
        ...(player1User ? { player1User } : {}),
      };
    }));
  },
});
