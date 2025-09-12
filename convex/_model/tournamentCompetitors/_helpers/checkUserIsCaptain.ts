import { Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';

export const checkUserIsCaptain = async (
  ctx: QueryCtx,
  tournamentCompetitorId: Id<'tournamentCompetitors'>,
  userId: Id<'users'> | null,
): Promise<boolean> => {
  if (!userId) {
    return false;
  }
  const record = await ctx.db.get(tournamentCompetitorId);
  return record?.captainUserId === userId;
};
