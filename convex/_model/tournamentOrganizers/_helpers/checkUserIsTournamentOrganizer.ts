import { Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';

export const checkUserIsTournamentOrganizer = async (
  ctx: QueryCtx,
  tournamentId: Id<'tournaments'>,
  userId: Id<'users'> | null,
): Promise<boolean> => {
  if (!userId) {
    return false;
  }
  const records = await ctx.db.query('tournamentOrganizers')
    .withIndex('by_tournament_user', (q) => q.eq('tournamentId', tournamentId).eq('userId', userId))
    .first();
  return !!records;
};
