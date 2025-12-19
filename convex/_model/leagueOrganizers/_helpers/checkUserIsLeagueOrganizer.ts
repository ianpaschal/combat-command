import { Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';

export const checkUserIsLeagueOrganizer = async (
  ctx: QueryCtx,
  leagueId: Id<'leagues'>,
  userId: Id<'users'> | null,
): Promise<boolean> => {
  if (!userId) {
    return false;
  }
  const record = await ctx.db.query('leagueOrganizers')
    .withIndex('by_league_user', (q) => q.eq('leagueId', leagueId).eq('userId', userId))
    .first();
  return !!record;
};
