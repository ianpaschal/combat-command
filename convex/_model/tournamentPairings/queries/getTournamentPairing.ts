import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenTournamentPairing } from '../_helpers/deepenTournamentPairing';
import { TournamentPairingDeep } from '../_helpers/deepenTournamentPairing';

export const getTournamentPairingArgs = v.object({
  id: v.id('tournamentPairings'),
});

/**
 * Gets a TournamentPairing by ID.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.id - ID of the Tournament
 * @returns - A deep TournamentPairing if found, otherwise null
 */
export const getTournamentPairing = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentPairingArgs>,
): Promise<TournamentPairingDeep | null> => {
  const tournamentPairing = await ctx.db.get(args.id);
  if (!tournamentPairing) {
    return null;
  }
  return await deepenTournamentPairing(ctx, tournamentPairing);
};
