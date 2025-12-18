import { MutationCtx } from '../../_generated/server';
import { TriggerChange } from '../common/types';
import { refreshLeagueRankings as refreshLeagueRankingsHandler } from '../leagues';

/**
 * Trigger refresh of league rankings if a tournament result is modified.
 * 
 * Several types of changes could cause this to be necessary:
 * - Score adjustments altered;
 * - Roster (registrations) changed;
 */
export const refreshLeagueRankings = async (
  ctx: MutationCtx,
  change: TriggerChange<'tournamentResults'>,
): Promise<void> => {
  const { newDoc } = change;

  // Ignore if competitor was deleted:
  if (!newDoc) {
    return;
  }

  // Refresh all existing tournament results:
  const leagues = await ctx.db.query('leagues')
    .withIndex('by_status', (q) => q.eq('status', 'active'))
    .collect();
  
  for (const league of leagues) {
    if (league.tournamentIds.includes(newDoc.tournamentId)) {
      await refreshLeagueRankingsHandler(ctx, { leagueId: league._id });
    }
  }
};
