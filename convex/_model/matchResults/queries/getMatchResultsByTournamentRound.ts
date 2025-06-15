import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenMatchResult, DeepMatchResult } from '../_helpers/deepenMatchResult';

export const getMatchResultsByTournamentRoundArgs = v.object({
  tournamentId: v.id('tournaments'),
  round: v.number(),
});

export const getMatchResultsByTournamentRound = async (
  ctx: QueryCtx,
  args: Infer<typeof getMatchResultsByTournamentRoundArgs>,
): Promise<DeepMatchResult[]> => {
  const tournamentPairings = await ctx.db.query('tournamentPairings')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', args.tournamentId))
    .filter((q) => q.eq(q.field('round'), args.round))
    .collect();
  const matchResults = await ctx.db.query('matchResults')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', args.tournamentId))
    .collect();
  const filteredMatchResults = matchResults.filter((result) => (
    !!tournamentPairings.find((item) => item._id === result.tournamentPairingId)
  ));
  const deepMatchResults = await Promise.all(filteredMatchResults.map(
    async (item) => await deepenMatchResult(ctx, item),
  ));
  return deepMatchResults;
};
