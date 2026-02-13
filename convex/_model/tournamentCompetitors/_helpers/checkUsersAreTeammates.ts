import { Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';

export const checkUsersAreTeammates = async (
  ctx: QueryCtx,
  user0Id: Id<'users'> | null,
  user1Id: Id<'users'> | null,
): Promise<boolean> => {
  if (!user0Id || !user1Id) {
    return false;
  }
  const player0Records = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_user', (q) => q.eq('userId', user0Id))
    .collect();
  const player1Records = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_user', (q) => q.eq('userId', user1Id))
    .collect();

  const player0CompetitorIds = new Set(player0Records.map((r) => r.tournamentCompetitorId));

  return player1Records.some((r) => player0CompetitorIds.has(r.tournamentCompetitorId),
  );
};
