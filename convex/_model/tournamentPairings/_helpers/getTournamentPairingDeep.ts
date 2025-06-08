import { Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { deepenTournamentPairing, TournamentPairingDeep } from './deepenTournamentPairing';
import { getTournamentPairingShallow } from './getTournamentPairingShallow';

/**
 * Gets a TournamentPairing from the database with additional relevant data joined (deep).
 * 
 * @remarks
 * This method should be used when you KNOW a TournamentPairing exists.
 * This is almost always the case.
 * If the document does not exist in the database, this function will throw an error.
 * 
 * @param ctx - Convex query context
 * @param id - ID of the TournamentPairing
 * @returns A deep TournamentPairing
 */
export const getTournamentPairingDeep = async (
  ctx: QueryCtx,
  id: Id<'tournamentPairings'>,
): Promise<TournamentPairingDeep> => {
  const tournamentPairing = await getTournamentPairingShallow(ctx, id);  
  return await deepenTournamentPairing(ctx, tournamentPairing);
};
