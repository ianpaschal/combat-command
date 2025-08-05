import { Doc, getAuthUserId } from '@convex-dev/auth/server';

import { QueryCtx } from '../../../_generated/server';
import { getStorageUrl } from '../../common/_helpers/getStorageUrl';
import { formatUserRealName } from '../_helpers/formatUserRealName';

export type CurrentUser = Doc<'users'> & {
  avatarUrl?: string;
  displayName: string; 
};

/**
 * Gets the querying user.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.id - ID of the user
 * @returns - A limited user if found, otherwise null
 */
export const getCurrentUser = async (
  ctx: QueryCtx,
): Promise<CurrentUser | null> => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    return null;
  }
  const user = await ctx.db.get(userId);
  if (!user) {
    return null;
  }
  return {
    ...user,
    avatarUrl : await getStorageUrl(ctx, user.avatarStorageId),
    displayName: formatUserRealName(user),
  };
};
