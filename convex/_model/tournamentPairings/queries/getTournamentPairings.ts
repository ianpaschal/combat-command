import { Query } from 'convex/server';
import { Infer, v } from 'convex/values';

import { DataModel, Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { notNullOrUndefined } from '../../_helpers/notNullOrUndefined';
import { deepenTournamentPairing, TournamentPairingDeep } from '../_helpers/deepenTournamentPairing';

export const getTournamentPairingsArgs = v.object({
  round: v.optional(v.number()),
  tournamentId: v.optional(v.id('tournaments')),
});

/**
 * Gets an array of deep TournamentPairings filtered by Tournament ID and round.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.round - The round to filter by
 * @param args.tournamentId - ID of the Tournament to filter by
 * @returns An array of deep TournamentPairings
 */
export const getTournamentPairings = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentPairingsArgs>,
): Promise<TournamentPairingDeep[]> => {
  const baseQuery = ctx.db.query('tournamentPairings');

  let indexedQuery: Query<DataModel['tournamentPairings']> = baseQuery;
  if (args.tournamentId !== undefined) {
    indexedQuery = baseQuery.withIndex('by_tournament_id', (q) => q.eq('tournamentId', args.tournamentId as Id<'tournaments'>));
  }

  let filteredQuery: Query<DataModel['tournamentPairings']> = indexedQuery;
  if (args.round !== undefined) { // 0 is a legitimate round index
    filteredQuery = indexedQuery.filter((q) => q.eq(q.field('round'), args.round));
  }

  const result = await filteredQuery.collect();
  const deepResults = await Promise.all(
    result.map(
      async (item) => await deepenTournamentPairing(ctx, item),
    ),
  );

  // TODO: Add pagination

  // Sort by table index:
  return deepResults.filter(notNullOrUndefined).sort((a, b) => {
    if (a.table === null) {
      return 1;
    }
    if (b.table === null) {
      return -1;
    }
    return a.table - b.table;
  });
};
