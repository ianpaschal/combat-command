import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';

import { redactUserInfo } from './utils/redactUserInfo';
import { Id } from '../_generated/dataModel';
import { query, QueryCtx } from '../_generated/server';

const getAvatarUrl = async (ctx: QueryCtx, storageId?: Id<'_storage'>): Promise<string | undefined> => {
  if (!storageId) {
    return undefined;
  }
  const avatarUrl = await ctx.storage.getUrl(storageId);
  if (avatarUrl) {
    return avatarUrl;
  }
  return undefined;
};

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
