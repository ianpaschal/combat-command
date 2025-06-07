import { Id } from '../../_generated/dataModel';
import { QueryCtx } from '../../_generated/server';
import { notNullOrUndefined } from '../_helpers/notNullOrUndefined';
import { getDeepMatchResult } from './getDeepMatchResult';

export const getMatchResultsByTournamentRound = async (
  ctx: QueryCtx,
  tournamentId: Id<'tournaments'>,
  round: number,
) => {
  const tournamentPairings = await ctx.db.query('tournamentPairings')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', tournamentId))
    .filter((q) => q.eq(q.field('round'), round))
    .collect();

  const results = await ctx.db.query('matchResults').collect();
  const filteredResults = results.filter((result) => !!tournamentPairings.find((item) => item._id === result.tournamentPairingId));
  const deepResults = await Promise.all(filteredResults.map(async (item) => await getDeepMatchResult(ctx, item)));

  // TODO: Add pagination
  return deepResults.filter(notNullOrUndefined);
};
