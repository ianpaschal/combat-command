import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { notNullOrUndefined } from '../../common/_helpers/notNullOrUndefined';
import { deepenTournamentPairing, TournamentPairingDeep } from '../_helpers/deepenTournamentPairing';

export const getTournamentPairingsByTournamentArgs = v.object({
  tournamentId: v.id('tournaments'),
});

/**
 * Gets an array of deep TournamentPairings from a given Tournament.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.tournamentId - ID of the Tournament to filter by
 * @returns An array of deep TournamentPairings
 */
export const getTournamentPairingsByTournament = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentPairingsByTournamentArgs>,
): Promise<TournamentPairingDeep[]> => {
  const tournamentPairings = await ctx.db.query('tournamentPairings')
    .withIndex('by_tournament_id', ((q) => q.eq('tournamentId', args.tournamentId)))
    .collect();
  const deepTournamentPairings = await Promise.all(
    tournamentPairings.map(async (tournamentPairing) => await deepenTournamentPairing(ctx, tournamentPairing)),
  );
  return deepTournamentPairings.filter(notNullOrUndefined);
};
