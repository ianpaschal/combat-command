import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { filterWithSearchTerm } from '../../common/_helpers/filterWithSearchTerm';
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
  const users = await ctx.db.query('users').collect();
  const limitedUsers = await Promise.all(users.map(async (user) => await redactUser(ctx, user)));
  if (args.search) {
    return filterWithSearchTerm(limitedUsers, args.search, [
      'displayName',
      'username',
    ]);
  }
  return limitedUsers;
};
