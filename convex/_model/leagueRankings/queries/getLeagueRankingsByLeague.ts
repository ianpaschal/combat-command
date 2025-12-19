import { paginationOptsValidator, PaginationResult } from 'convex/server';
import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenLeagueRanking } from '../_helpers/deepenLeagueRanking';
import { LeagueRanking } from '../types';

export const getLeagueRankingsByLeagueArgs = v.object({
  leagueId: v.id('leagues'),
  paginationOpts: paginationOptsValidator,
});

export const getLeagueRankingsByLeague = async (
  ctx: QueryCtx,
  args: Infer<typeof getLeagueRankingsByLeagueArgs>,
): Promise<PaginationResult<LeagueRanking>> => {
  const results = await ctx.db.query('leagueRankings')
    .withIndex('by_league', (q) => q.eq('leagueId', args.leagueId))
    .order('asc')
    .paginate(args.paginationOpts);

  return {
    ...results,
    page: await Promise.all(results.page.map(
      async (item) => await deepenLeagueRanking(ctx, item),
    )),
  };
};
