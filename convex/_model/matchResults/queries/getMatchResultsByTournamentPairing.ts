import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenMatchResult, DeepMatchResult } from '../_helpers/deepenMatchResult';

export const getMatchResultsByTournamentPairingArgs = v.object({
  tournamentPairingId: v.id('tournamentPairings'),
});

export const getMatchResultsByTournamentPairing = async (
  ctx: QueryCtx,
  args: Infer<typeof getMatchResultsByTournamentPairingArgs>,
): Promise<DeepMatchResult[]> => {
  const matchResults = await ctx.db.query('matchResults')
    .withIndex('by_tournament_pairing_id', (q) => q.eq('tournamentPairingId', args.tournamentPairingId))
    .collect();
  return await Promise.all(matchResults.map(
    async (item) => await deepenMatchResult(ctx, item),
  ));
};
