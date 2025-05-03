import { Query } from 'convex/server';
import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { DataModel, Id } from '../../_generated/dataModel';
import { QueryCtx } from '../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { notNullOrUndefined } from '../_helpers/notNullOrUndefined';
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

export const getTournamentPairingListArgs = v.object({
  tournamentId: v.optional(v.id('tournaments')),
  round: v.optional(v.number()),
});

export type GetTournamentPairingList = Awaited<ReturnType<typeof getTournamentPairingList>>;

export const getTournamentPairingList = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentPairingListArgs>,
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
  return deepResults.filter(notNullOrUndefined);
};
