import { ConvexError } from 'convex/values';

import { MutationCtx } from '../../_generated/server';
import { getErrorMessage } from '../common/errors';
import { TriggerChange } from '../common/types';
import { refreshTournamentResult } from '../tournamentResults';

/**
 * Trigger refresh of tournament results if a tournament competitor is modified.
 * 
 * Several types of changes could cause this to be necessary:
 * - Score adjustments altered;
 * - Roster (registrations) changed;
 */
export const refreshTournamentResults = async (
  ctx: MutationCtx,
  change: TriggerChange<'tournamentCompetitors'>,
): Promise<void> => {
  const { newDoc } = change;

  // Ignore if competitor was deleted:
  if (!newDoc) {
    return;
  }

  // Get the relevant tournament pairing to identify round:
  const tournament = await ctx.db.get(newDoc.tournamentId);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }

  // Refresh all existing tournament results:
  const tournamentResults = await ctx.db.query('tournamentResults')
    .withIndex('by_tournament_round', (q) => q.eq('tournamentId', newDoc.tournamentId))
    .collect();
  
  for (const tournamentResult of tournamentResults) {
    await refreshTournamentResult(ctx, tournamentResult);
  }
};
