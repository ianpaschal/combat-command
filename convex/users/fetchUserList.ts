import { getAvatarUrl } from './utils/getAvatarUrl';
import { redactUserInfo } from './utils/redactUserInfo';
import { query } from '../_generated/server';

export const fetchUserList = query({
  args: {
    // TODO: Add tournamentId, tournamentCompetitorId, clubId
  },
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect();
    return Promise.all(users.map(async (u) => ({
      ...await redactUserInfo(ctx, u),
      avatarUrl: await getAvatarUrl(ctx, u.avatarStorageId),
    })));
  },
});
