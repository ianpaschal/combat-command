import { paginationOptsValidator, PaginationResult } from 'convex/server';
import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenMatchResult, DeepMatchResult } from '../_helpers/deepenMatchResult';

export const getMatchResultsArgs = v.object({
  paginationOpts: paginationOptsValidator,
  filter: v.optional(v.object({
    tournamentId: v.optional(v.id('tournaments')),
    tournamentPairingId: v.optional(v.id('tournaments')),
    tournamentCompetitorId: v.optional(v.id('tournaments')),
  })),
});

export const getMatchResults = async (
  ctx: QueryCtx,
  args: Infer<typeof getMatchResultsArgs>,
): Promise<PaginationResult<DeepMatchResult>> => {
  const results = await ctx.db.query('matchResults').order('desc').paginate(args.paginationOpts);
  return {
    ...results,
    page: await Promise.all(results.page.map(
      async (item) => await deepenMatchResult(ctx, item),
    )),
  };
};
