import { Doc, Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getTournamentPairingDeep } from '../../tournamentPairings';
import { getTournamentShallow } from '../../tournaments';

/**
 * Checks if a user has permission to mutate match result.
 *
 * @throws If the match result belongs to a tournament and the user is not an organizer that tournament.
 * 
 * @param ctx - Convex query context
 * @param userId - ID of the querying user
 * @param matchResult - Raw match result document
 */
export const checkMatchResultAuth = async (
  ctx: QueryCtx,
  userId: Id<'users'>,
  matchResult: Doc<'matchResults'>,
): Promise<void> => {
  if (matchResult.tournamentPairingId) {
    // Perform tournament-based auth checks for matches with a tournament pairing:
    const tournamentPairing = await getTournamentPairingDeep(ctx, matchResult.tournamentPairingId);
    const tournament = await getTournamentShallow(ctx, tournamentPairing.tournamentId);

    const isTournamentOrganizer = tournament.organizerUserIds.includes(userId);
    if (!isTournamentOrganizer ) {
      // TODO: Proper convex error
      throw 'You do not have permission to do that.';
    }
  }
};
