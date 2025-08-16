import { getAuthUserId } from '@convex-dev/auth/server';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { checkUserIsTournamentOrganizer } from '../../tournamentOrganizers';

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

  // If the match result's pairing has gone missing, treat it the same as a single match:
  const tournamentPairing = await ctx.db.get(matchResult.tournamentPairingId);
  if (!tournamentPairing) {
    return true;
  }

  // If the match result is not from an on-going tournament, battle plans should be visible:
  const tournament = await ctx.db.get(tournamentPairing.tournamentId);
  if (!tournament || tournament?.status !== 'active') {
    return true;
  }

  if (userId) {

    // If the requesting user is an organizer, battle plans should be visible:
    const isOrganizer = await checkUserIsTournamentOrganizer(ctx, tournament._id, userId );
    if (isOrganizer) {
      return true;
    }

    // If the requesting user is a player within that pairing, battle plans should be visible:
    if (matchResult.player0UserId === userId || matchResult.player1UserId === userId) {
      return true;
    }
  }

  // Hide battle plans in all other cases:
  return false;
};
