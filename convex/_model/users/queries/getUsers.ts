import {
  OrderedQuery,
  paginationOptsValidator,
  PaginationResult,
  QueryInitializer,
} from 'convex/server';
import { Infer, v } from 'convex/values';

import { DataModel } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { LimitedUser, redactUser } from '../_helpers/redactUser';

export const getUsersArgs = v.object({
  search: v.optional(v.string()),
  excludeIds: v.optional(v.array(v.id('users'))),
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
  const baseQuery: QueryInitializer<DataModel['users']> = ctx.db.query('users');

  let orderedQuery: OrderedQuery<DataModel['users']> = baseQuery;
  if (args.search && args.search.trim() !== '') {
    orderedQuery = baseQuery.withSearchIndex('search', (q) => q.search('search', args.search!));
  }

  if (args.excludeIds && args.excludeIds.length > 0) {
    orderedQuery = orderedQuery.filter((q) => q.not(q.or(
      ...args.excludeIds!.map((id) => q.eq(q.field('_id'), id)),
    )));
  }

  const results = await orderedQuery.paginate(args.paginationOpts);
  
  return {
    ...results,
    page: (await Promise.all(results.page.map(
      async (item) => await redactUser(ctx, item),
    ))).sort((a, b) => a.displayName.localeCompare(b.displayName)),
  };
};
