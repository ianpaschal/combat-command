import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { getDeepTournamentPairing, TournamentPairingDeep } from '../helpers';

export const getActiveTournamentPairingsByUserArgs = v.object({
  userId: v.id('users'),
});

/**
 * Fetches a list of all tournament pairings for a user which are part of an on-going tournament.
 * Pairings are considered relevant to the user if:
 *   - The user is an organizer of the tournament that pairing belongs to;
 *   - The user is a player within a competitor in that pairing;
 * @param ctx - Convex query context.
 * @param args - Convex query args.
 * @param args.userId - User ID to filter by.
 * @returns - Array of deep tournament pairings.
 */
export const getActiveTournamentPairingsByUser = async (
  ctx: QueryCtx,
  args: Infer<typeof getActiveTournamentPairingsByUserArgs>,
): Promise<TournamentPairingDeep[]> => {

  // Fetch all on-going tournaments.
  // It's unlikely there are ever more than a few at any given moment.
  const activeTournaments = await ctx.db.query('tournaments')
    .withIndex('by_status', ((q) => q.eq('status', 'active')))
    .collect();

  // Get all pairings which are part of an active tournament
  const tournamentPairings = await ctx.db.query('tournamentPairings').collect();
  const activeTournamentPairings = await Promise.all(tournamentPairings.filter(async (tournamentPairing) => {
    const tournament = activeTournaments.find((activeTournament) => activeTournament._id === tournamentPairing.tournamentId);

    // If pairing belongs to an inactive tournament OR an active tournament but not the current round, exclude it:
    if (!tournament || tournament.currentRound !== tournamentPairing.round) {
      return false;
    }

    // If pairing belongs to a tournament which user is an organizer of, include it:
    if (tournament.organizerUserIds.includes(args.userId)) {
      return true;
    }

    // If pairing includes a competitor which includes user, include it:
    const deepPairing = await getDeepTournamentPairing(ctx, tournamentPairing);
    if (deepPairing.playerUserIds.includes(args.userId)) {
      return true;
    }

    return false;
  }));

  return await Promise.all(
    activeTournamentPairings.map(
      async (item) => await getDeepTournamentPairing(ctx, item),
    ),
  );
};
