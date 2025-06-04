import { Query } from 'convex/server';
import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { generateDraftAdjacentPairings } from './actions/generateDraftAdjacentPairings';
import { generateDraftRandomPairings } from './actions/generateDraftRandomPairings';
import { DataModel, Id } from '../../_generated/dataModel';
import { QueryCtx } from '../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { tournamentPairingMethod } from '../../static/tournamentPairingMethods';
import { notNullOrUndefined } from '../_helpers/notNullOrUndefined';
import { getTournamentCompetitorListByTournamentId } from '../tournamentCompetitors';
import { getTournamentRankings } from '../tournaments/queries/getTournamentRankings';
// import { getTournamentRankings } from '../tournamentRankings';
import { getDeepTournamentPairing } from './helpers';

export const getTournamentPairingArgs = v.object({
  id: v.id('tournamentPairings'),
});

export const getTournamentPairing = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentPairingArgs>,
) => {
  const result = await ctx.db.get(args.id);
  if (!result) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_PAIRING_NOT_FOUND'));
  }
  return await getDeepTournamentPairing(ctx, result);
};

export const getTournamentPairingsArgs = v.object({
  tournamentId: v.optional(v.id('tournaments')),
  round: v.optional(v.number()),
});

export const getTournamentPairings = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentPairingsArgs>,
) => {
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
      async (item) => await getDeepTournamentPairing(ctx, item),
    ),
  );

  // TODO: Add pagination
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

export const getDraftTournamentPairingsArgs = v.object({
  tournamentId: v.id('tournaments'),
  round: v.number(),
  method: tournamentPairingMethod,
});

/**
 * 
 * @param ctx 
 * @param args - Convex query args.
 * @param args.round - The upcoming round index which the generated pairing are for.
 * @returns 
 */
export const getDraftTournamentPairings = async (
  ctx: QueryCtx,
  args: Infer<typeof getDraftTournamentPairingsArgs>,
) => {
  const competitors = await getTournamentCompetitorListByTournamentId(ctx, args);
  const { competitors: rankedCompetitors } = await getTournamentRankings(ctx, {
    tournamentId: args.tournamentId,
    round: args.round - 1, // Get rankings for previous round
  });
  const activeCompetitors = rankedCompetitors.filter(({ id }) => !!competitors.find((c) => c._id === id && c.active));
  if (args.method === 'adjacent') {
    return generateDraftAdjacentPairings(activeCompetitors);
  }
  if (args.method === 'random') {
    return generateDraftRandomPairings(activeCompetitors);
  }
  return {
    pairings: [],
    unpairedCompetitors: [],
  };
};
