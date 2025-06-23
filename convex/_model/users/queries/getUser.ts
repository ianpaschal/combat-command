import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { LimitedUser, redactUser } from '../_helpers/redactUser';

export const getUserArgs = v.object({
  id: v.id('users'),
});

/**
 * Gets a user by ID.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.id - ID of the user
 * @returns - A limited user if found, otherwise null
 */
export const getUser = async (
  ctx: QueryCtx,
  args: Infer<typeof getUserArgs>,
): Promise<LimitedUser | null> => {
  const user = await ctx.db.get(args.id);
  if (!user) {
    return null;
  }

  // --- CHECK AUTH ----
  return await redactUser(ctx, user);
};
