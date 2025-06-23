import { getAuthUserId } from '@convex-dev/auth/server';

import { QueryCtx } from '../../../_generated/server';
import { LimitedUser } from '../_helpers/redactUser';
import { getUser } from './getUser';

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
): Promise<LimitedUser | null> => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    return null;
  }
  return await getUser(ctx, { id: userId });
};
