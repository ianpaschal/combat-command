import { ConvexError } from 'convex/values';

import { Doc, Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../common/errors';

/**
 * Gets a TournamentPairing from the database without joining any additional data (shallow).
 * 
 * @remarks
 * This method should be used when you KNOW a TournamentPairing exists.
 * This is almost always the case.
 * If the document does not exist in the database, this function will throw an error.
 * 
 * @param ctx - Convex query context
 * @param id - ID of the TournamentPairing
 * @returns A raw TournamentPairing document
 */
export const getTournamentPairingShallow = async (
  ctx: QueryCtx,
  id: Id<'tournamentPairings'>,
): Promise<Doc<'tournamentPairings'>> => {
  const tournamentPairing = await ctx.db.get(id);
  if (!tournamentPairing) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_PAIRING_NOT_FOUND'));
  }
  return tournamentPairing;
};
