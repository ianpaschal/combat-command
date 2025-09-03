import { paginationOptsValidator, PaginationResult } from 'convex/server';
import { Infer, v } from 'convex/values';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { LimitedUser, redactUser } from '../_helpers/redactUser';

export const getUsersArgs = v.object({
  search: v.optional(v.string()),
  paginationOpts: paginationOptsValidator,
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
): Promise<PaginationResult<LimitedUser>> => {
  let results: PaginationResult<Doc<'users'>>;
  if (args.search && args.search.trim() !== '') {
    results = await ctx.db
      .query('users')
      .withSearchIndex('search', (q) => q.search('search', args.search!))
      .paginate(args.paginationOpts);
  } else {
    results = await ctx.db.query('users').paginate(args.paginationOpts);
  }
  return {
    ...results,
    page: (await Promise.all(results.page.map(
      async (item) => await redactUser(ctx, item),
    ))).sort((a, b) => a.displayName.localeCompare(b.displayName)),
  };
};
