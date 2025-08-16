import { Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';

/**
 * Get a list of user IDs for the players of a tournament.
 * 
 * @param ctx - Convex query context
 * @param tournamentId - ID of the tournament
 * @param activeOnly - Limit to active players
 * @returns Array of user IDs
 */
export const getTournamentPlayerUserIds = async (
  ctx: QueryCtx,
  tournamentId: Id<'tournaments'>,
  activeOnly = false,
): Promise<Id<'users'>[]> => {
  const tournamentRegistrations = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_tournament', (q) => q.eq('tournamentId', tournamentId))
    .collect();
  return tournamentRegistrations.filter((r) => activeOnly ? r.active : true).map((r) => r.userId);
};
