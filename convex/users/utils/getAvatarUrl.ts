import { Id } from '../../_generated/dataModel';
import { QueryCtx } from '../../_generated/server';

export const getAvatarUrl = async (ctx: QueryCtx, storageId?: Id<'_storage'>): Promise<string | undefined> => {
  if (!storageId) {
    return undefined;
  }
  const avatarUrl = await ctx.storage.getUrl(storageId);
  if (avatarUrl) {
    return avatarUrl;
  }
  return undefined;
};
