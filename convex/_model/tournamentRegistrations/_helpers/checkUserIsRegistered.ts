import { Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';

export const checkUserIsRegistered = async (
  ctx: QueryCtx,
  tournamentId: Id<'tournaments'>,
  userId: Id<'users'> | null,
): Promise<boolean> => {
  if (!userId) {
    return false;
  }
  const record = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_tournament_user', (q) => q.eq('tournamentId', tournamentId).eq('userId', userId))
    .first();
  return !!record;
};
