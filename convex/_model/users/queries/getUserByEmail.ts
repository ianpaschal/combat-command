import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { LimitedUser, redactUser } from '../_helpers/redactUser';

export const getUserByEmailArgs = v.object({
  email: v.string(),
});

/**
 * Gets a user by email address.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.id - ID of the user
 * @returns - A limited user if found, otherwise null
 */
export const getUserByEmail = async (
  ctx: QueryCtx,
  args: Infer<typeof getUserByEmailArgs>,
): Promise<LimitedUser | null> => {
  const user = await ctx.db.query('users')
    .withIndex('by_email', (q) => q.eq('email', args.email))
    .unique();
  if (!user) {
    return null;
  }

  // --- CHECK AUTH ----
  return await redactUser(ctx, user);
};
