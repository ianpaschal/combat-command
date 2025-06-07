import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../_generated/server';
import { notNullOrUndefined } from '../_helpers/notNullOrUndefined';
import { getDeepMatchResult } from './getDeepMatchResult';

export const getMatchResultsByTournamentArgs = v.object({
  tournamentId: v.id('tournaments'),
});

export const getMatchResultsByTournament = async (
  ctx: QueryCtx,
  args: Infer<typeof getMatchResultsByTournamentArgs>,
) => {
  const tournamentPairings = await ctx.db.query('tournamentPairings')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', args.tournamentId))
    .collect();

  const results = await ctx.db.query('matchResults').collect();
  const filteredResults = results.filter((result) => !!tournamentPairings.find((item) => item._id === result.tournamentPairingId));
  const deepResults = await Promise.all(filteredResults.map(async (item) => await getDeepMatchResult(ctx, item)));

  // TODO: Add pagination
  return deepResults.filter(notNullOrUndefined);
};
