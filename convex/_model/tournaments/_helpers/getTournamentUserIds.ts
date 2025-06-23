import { Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';

/**
 * Gets all user IDs linked by a common tournament.
 * 
 * @param ctx - Convex query context
 * @param id - ID of the tournament
 * @returns An array of user IDs
 */
export const getTournamentUserIds = async (
  ctx: QueryCtx,
  id: Id<'tournaments'>,
): Promise<Id<'users'>[]> => {
  const tournamentCompetitors = await ctx.db.query('tournamentCompetitors')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', id))
    .collect();
  const playerUserIds = tournamentCompetitors.reduce((acc, c) => [
    ...acc,
    ...c.players.map((p) => p.userId),
  ], [] as Id<'users'>[]);

  // Pass through Set() to remove duplicates
  return Array.from(new Set(playerUserIds));
};
