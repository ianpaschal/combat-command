import { ConvexError } from 'convex/values';

import { MutationCtx } from '../../_generated/server';
import { getErrorMessage } from '../common/errors';
import { TriggerChange } from '../common/types';
import { refreshTournamentResult } from '../tournamentResults';

/**
 * Trigger refresh of tournament results if a tournament match result is modified.
 */
export const refreshTournamentResults = async (
  ctx: MutationCtx,
  change: TriggerChange<'matchResults'>,
): Promise<void> => {
  const { newDoc } = change;
  
  // Ignore if match result is not for a tournament:
  if (!newDoc?.tournamentPairingId) {
    return;
  }

  // DON'T ALTER RESULTS OF ARCHIVED TOURNAMENTS!
  if (newDoc.tournamentId) {
    const tournament = await ctx.db.get(newDoc.tournamentId);
    if (!tournament) {
      throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
    }
    if (tournament.status === 'archived') {
      return; // No need to throw an error but also don't change anything.
    }
  }

  // Get the relevant tournament pairing to identify round:
  const tournamentPairing = await ctx.db.get(newDoc.tournamentPairingId);
  if (!tournamentPairing) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_PAIRING_NOT_FOUND'));
  }

  const { tournamentId, round } = tournamentPairing;

  // Refresh the tournament results for that round and any subsequent rounds:
  const tournamentResults = await ctx.db.query('tournamentResults')
    .withIndex('by_tournament_round', (q) => q.eq('tournamentId', tournamentId).gte('round', round))
    .collect();
  
  for (const tournamentResult of tournamentResults) {
    await refreshTournamentResult(ctx, tournamentResult);
  }
};
