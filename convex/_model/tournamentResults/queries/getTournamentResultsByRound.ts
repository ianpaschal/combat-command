import { Query, QueryInitializer } from 'convex/server';
import { Infer, v } from 'convex/values';

import { DataModel, Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';

export const getTournamentResultsByRoundArgs = v.object({
  tournamentId: v.id('tournaments'),
  round: v.number(),
});

export const getTournamentResultsByRound = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentResultsByRoundArgs>,
): Promise<Doc<'tournamentResults'> | null> => {
  const { round, tournamentId } = args; // Make immutable
  const baseQuery: QueryInitializer<DataModel['tournamentResults']> = ctx.db.query('tournamentResults');
  let indexedQuery: Query<DataModel['tournamentResults']> = baseQuery;
  if (round !== undefined) {
    indexedQuery = baseQuery.withIndex('by_tournament_round', (q) => q.eq('tournamentId', tournamentId).eq('round', round));
  } else {
    indexedQuery = baseQuery.withIndex('by_tournament_round', (q) => q.eq('tournamentId', tournamentId));
  }
  return await indexedQuery.order('desc').first();
};
