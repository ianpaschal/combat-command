import { getAuthUserId } from '@convex-dev/auth/server';

import { Doc, Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';

/**
 * Checks if a match result's details should be visible or not.
 * 
 * @param ctx - Convex query context
 * @param matchResult - Raw match result document
 * @returns True if the details should be visible, false if not
 */
export const checkMatchResultDetailsVisibility = async (
  ctx: QueryCtx,
  matchResult: Doc<'matchResults'>,
): Promise<boolean> => {
  const userId = await getAuthUserId(ctx);

  // If the match result doesn't belong to a tournament pairing, details should be visible:
  if (!matchResult?.tournamentPairingId) {
    return true;
  }

  // If the match result's pairing has gone missing, treat it the same as a single match:
  const pairing = await ctx.db.get(matchResult.tournamentPairingId);
  if (!pairing) {
    return true;
  }
  const competitor0 = await ctx.db.get(pairing.tournamentCompetitor0Id);
  const competitor1 = pairing.tournamentCompetitor1Id ? await ctx.db.get(pairing.tournamentCompetitor1Id) : null;
  const pairingUserIds = [competitor0, competitor1].reduce((acc, competitor) => {
    if (competitor) {
      return [
        ...acc,
        ...competitor.players.map((player) => player.userId),
      ];
    }
    return acc;
  }, [] as Id<'users'>[]);

  // If the match result is not from an on-going tournament, details should be visible:
  const tournament = await ctx.db.get(pairing.tournamentId);
  if (!tournament || tournament?.status !== 'active') {
    return true;
  }

  // If the requesting user is an organizer, details should be visible:
  if (userId && tournament.organizerUserIds.includes(userId)) {
    return true;
  }

  // If the requesting user is a player within that match result's pairing, details should be visible:
  if (userId && pairingUserIds.includes(userId)) {
    return true;
  }

  // Hide details in all other cases:
  return false;
};
