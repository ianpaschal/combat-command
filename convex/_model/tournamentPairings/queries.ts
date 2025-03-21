import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

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

export const getTournamentPairingList = async (
  ctx: QueryCtx,
) => {
  const result = await ctx.db.query('tournamentPairings').collect();
  const deepResults = await Promise.all(
    result.map(
      async (item) => await getDeepTournamentPairing(ctx, item),
    ),
  );

  // TODO: Add pagination
  return deepResults.filter(notNullOrUndefined);
};
