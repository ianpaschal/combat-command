import { getAuthUserId } from '@convex-dev/auth/server';

import { Doc } from '../../_generated/dataModel';
import { QueryCtx } from '../../_generated/server';

export const getUserPreferences = async (
  ctx: QueryCtx,
): Promise<Doc<'userPreferences'> | null> => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    return null;
  }

  return await ctx.db.query('userPreferences')
    .withIndex('by_user_id', (q) => q.eq('userId', userId))
    .first();
};
