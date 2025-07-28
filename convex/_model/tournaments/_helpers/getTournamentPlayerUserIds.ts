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
  const tournamentCompetitors = await ctx.db.query('tournamentCompetitors').withIndex(
    'by_tournament_id',
    (q) => q.eq('tournamentId', tournamentId),
  ).collect();
  return tournamentCompetitors.reduce((acc, c) => [
    ...acc,
    ...c.players.filter((p) => activeOnly ? p.active : true).map((p) => p.userId),
  ], [] as Id<'users'>[]);
};
