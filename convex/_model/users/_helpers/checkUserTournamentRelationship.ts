import { Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';

export const checkUserTournamentRelationship = async (
  ctx: QueryCtx,
  userIdA?: Id<'users'> | null,
  userIdB?: Id<'users'> | null,
): Promise<boolean> => {
  if (!userIdA || !userIdB) {
    return false;
  }

  const userARegistrations = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_user', (q) => q.eq('userId', userIdA))
    .collect();
  const userBRegistrations = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_user', (q) => q.eq('userId', userIdA))
    .collect();

  const userATournamentIds = [
    ...userARegistrations.map((r) => r.tournamentId),
  ];

  const userBTournamentIds = [
    ...userBRegistrations.map((r) => r.tournamentId),
  ];

  return userATournamentIds.some((id) => new Set(userBTournamentIds).has(id));
};
