import { paginationOptsValidator, PaginationResult } from 'convex/server';
import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenMatchResult, DeepMatchResult } from '../_helpers/deepenMatchResult';

export const getMatchResultsByUserArgs = v.object({
  userId: v.id('users'),
  paginationOpts: paginationOptsValidator,
});

export const getMatchResultsByUser = async (
  ctx: QueryCtx,
  args: Infer<typeof getMatchResultsByUserArgs>,
): Promise<PaginationResult<DeepMatchResult>> => {
  const results = await ctx.db.query('matchResults')
    .filter((q) => q.or(
      q.eq(q.field('player0UserId'), args.userId),
      q.eq(q.field('player1UserId'), args.userId),
    ))
    .order('desc')
    .paginate(args.paginationOpts);
  return {
    ...results,
    page: await Promise.all(results.page.map(
      async (item) => await deepenMatchResult(ctx, item),
    )),
  };
};
