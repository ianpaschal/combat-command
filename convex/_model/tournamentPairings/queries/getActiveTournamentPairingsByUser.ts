import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { notNullOrUndefined } from '../../common/_helpers/notNullOrUndefined';
import { checkUserIsTournamentOrganizer } from '../../tournamentOrganizers';
import { deepenTournamentPairing, TournamentPairingDeep } from '../_helpers/deepenTournamentPairing';

export const getActiveTournamentPairingsByUserArgs = v.object({
  userId: v.id('users'),
  round: v.optional(v.number()),
});

/**
 * Fetches a list of deep TournamentPairings for a User which are part of an on-going Tournament.
 * TournamentPairings are considered relevant to the User if:
 *   - The User is an organizer of the Tournament that TournamentPairing belongs to;
 *   - The User is a player within a TournamentCompetitor in that TournamentPairing;
 *
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.userId - ID of the User to filter by
 * @returns - Array of deep TournamentPairings
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
  
  // Return the ones which qualify for the given user ID.
  return (await Promise.all(tournamentPairings.map(async (tournamentPairing) => {
    const tournament = activeTournaments.find((activeTournament) => activeTournament._id === tournamentPairing.tournamentId);

    const round = args.round ?? tournament?.currentRound;

    // If pairing belongs to an inactive tournament OR an active tournament but not the correct round, exclude it:
    if (!tournament || round !== tournamentPairing.round) {
      return null;
    }

    const deepPairing = await deepenTournamentPairing(ctx, tournamentPairing);

    const isOrganizer = await checkUserIsTournamentOrganizer(ctx, tournament._id, args.userId);
    const isPlayer = deepPairing.playerUserIds.includes(args.userId);

    // If user is organizer of the pairing's tournament, or a player in the pairing, include it:
    if (isOrganizer || isPlayer) {
      return deepPairing;
    }

    // Otherwise, exclude it:
    return null;
  }))).filter(notNullOrUndefined);
};
