import { Infer, v } from 'convex/values';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { LimitedUser, redactUser } from '../_helpers/redactUser';

export const getUsersArgs = v.object({
  search: v.optional(v.string()),
});

/**
 * Gets an array of limited users.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.search - Search text
 * @returns An array of limited users
 */
export const getUsers = async (
  ctx: QueryCtx,
  args: Infer<typeof getUsersArgs>,
): Promise<LimitedUser[]> => {
  let users: Doc<'users'> [];
  if (args.search && args.search.trim() !== '') {
    users = await ctx.db
      .query('users')
      .withSearchIndex('search', (q) => q.search('search', args.search!))
      .collect();
  } else {
    users = await ctx.db.query('users').collect();
  }
  return await Promise.all(users.map(async (user) => await redactUser(ctx, user)));
};
