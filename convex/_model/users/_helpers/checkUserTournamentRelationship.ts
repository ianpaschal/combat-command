import { Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getTournamentUserIds } from '../../../_model/tournaments';

export const checkUserTournamentRelationship = async (
  ctx: QueryCtx,
  userIdA?: Id<'users'> | null,
  userIdB?: Id<'users'> | null,
): Promise<boolean> => {
  if (!userIdA || !userIdB) {
    return false;
  }

  const tournaments = await ctx.db.query('tournaments').collect();

  // Check each tournament for a relationship, return true if one is found
  for (const { _id, organizerUserIds } of tournaments) {
    const playerUserIds = await getTournamentUserIds(ctx, _id);

    // Merge all organizer IDs and player IDs into one set
    const allTournamentUserIds = new Set([
      ...organizerUserIds,
      ...playerUserIds,
    ]);

    // If the set contains both user IDs, they were at the same tournament
    if (allTournamentUserIds.has(userIdA) && allTournamentUserIds.has(userIdB)) {
      return true;
    }
  }
  return false;
};
