import { Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';

export const checkUserIsPlayer = async (
  ctx: QueryCtx,
  tournamentCompetitorId: Id<'tournamentCompetitors'>,
  userId: Id<'users'> | null,
): Promise<boolean> => {
  if (!userId) {
    return false;
  }
  const record = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_tournament_competitor_user', (q) => q.eq('tournamentCompetitorId', tournamentCompetitorId).eq('userId', userId))
    .first();
  return !!record;
};
