import { getLimitedUser } from './utils/getLimitedUser';
import { query } from '../_generated/server';

export const fetchUserList = query({
  args: {
    // TODO: Add tournamentId, tournamentCompetitorId, clubId
  },
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect();
    return users.map(async (u) => ({
      ...await getLimitedUser(ctx, u),
      avatarUrl: u.avatarStorageId ? await ctx.storage.getUrl(u.avatarStorageId) : undefined,
    }));
  },
});
