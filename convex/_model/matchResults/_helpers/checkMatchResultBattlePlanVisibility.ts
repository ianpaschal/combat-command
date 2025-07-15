import { getAuthUserId } from '@convex-dev/auth/server';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getTournamentShallow } from '../../../_model/tournaments';
import { deepenTournamentPairing } from '../../tournamentPairings';

/**
 * Checks if a match result's battle plans should be visible or not.
 * 
 * @param ctx - Convex query context
 * @param matchResult - Raw match result document
 * @returns True if the battle plans should be visible, false if not
 */
export const checkMatchResultBattlePlanVisibility = async (
  ctx: QueryCtx,
  matchResult: Doc<'matchResults'>,
): Promise<boolean> => {
  const userId = await getAuthUserId(ctx);

  // If the match result doesn't belong to a tournament pairing, battle plans should be visible:
  if (!matchResult?.tournamentPairingId) {
    return true;
  }

  const tournamentPairing = await ctx.db.get(matchResult.tournamentPairingId);

  // If the match result's pairing has gone missing, treat it the same as a single match:
  if (!tournamentPairing) {
    return true;
  }
  const deepTournamentPairing = await deepenTournamentPairing(ctx, tournamentPairing);
  const tournament = await getTournamentShallow(ctx, deepTournamentPairing.tournamentId);

  // If the match result is not from an on-going tournament, battle plans should be visible:
  if (tournament?.status !== 'active') {
    return true;
  }

  if (userId) {

    // If the requesting user is an organizer, battle plans should be visible:
    if (tournament.organizerUserIds.includes(userId)) {
      return true;
    }

    // If the requesting user is a player within that pairing, battle plans should be visible:
    if (deepTournamentPairing.playerUserIds.includes(userId)) {
      return true;
    }
  }

  // Hide battle plans in all other cases:
  return false;
};
