import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenMatchResult, DeepMatchResult } from '../_helpers/deepenMatchResult';

export const getMatchResultsByTournamentArgs = v.object({
  tournamentId: v.id('tournaments'),
});

export const getMatchResultsByTournament = async (
  ctx: QueryCtx,
  args: Infer<typeof getMatchResultsByTournamentArgs>,
): Promise<DeepMatchResult[]> => {
  const matchResults = await ctx.db.query('matchResults')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', args.tournamentId))
    .order('desc')
    .collect();
  return await Promise.all(matchResults.map(
    async (item) => await deepenMatchResult(ctx, item),
  ));
};
