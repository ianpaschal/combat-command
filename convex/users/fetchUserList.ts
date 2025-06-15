import { v } from 'convex/values';

import { getAvatarUrl } from './utils/getAvatarUrl';
import { redactUserInfo } from './utils/redactUserInfo';
import { query } from '../_generated/server';
import { filterWithSearchTerm } from '../_model/common/_helpers/filterWithSearchTerm';

export const fetchUserList = query({
  args: {
    // TODO: Add tournamentId, tournamentCompetitorId, clubId
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db.query('users').collect();
    const results = await Promise.all(users.map(async (u) => ({
      ...await redactUserInfo(ctx, u),
      avatarUrl: await getAvatarUrl(ctx, u.avatarStorageId),
    })));
    return filterWithSearchTerm(results, args.search ?? '', ['familyName', 'givenName', 'username']);
  },
});
