import { Doc, Id } from '../../_generated/dataModel';
import { QueryCtx } from '../../_generated/server';
import { redactUserInfo } from './redactUserInfo';

export const getLimitedUser = async (
  ctx: QueryCtx,
  id?: Id<'users'>,
): Promise<Doc<'users'> & { avatarUrl?: string } | undefined> => {
  if (!id) {
    return undefined;
  }
  const user = await ctx.db.get(id);
  if (!user) {
    return undefined;
  }
  const avatarUrl = user.avatarStorageId ? await ctx.storage.getUrl(user.avatarStorageId) : undefined;
  return {
    ...await redactUserInfo(ctx, user),
    avatarUrl: avatarUrl || undefined,
  };
};
