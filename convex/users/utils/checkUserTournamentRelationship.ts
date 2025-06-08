import { Id } from '../../_generated/dataModel';
import { QueryCtx } from '../../_generated/server';
import { getTournamentUserIds } from '../../_model/tournaments';

type CheckUserTournamentRelationshipArgs = {
  queryingUserId: Id<'users'>;
  evaluatingUserId: Id<'users'>;
};

export const checkUserTournamentRelationship = async (
  ctx: QueryCtx,
  args: CheckUserTournamentRelationshipArgs,
): Promise<boolean> => {
  const tournaments = await ctx.db.query('tournaments').collect();

  // Check each tournament for a relationship, return true if one is found
  return tournaments.some(async (tournament) => {

    const competitorUserIds = await getTournamentUserIds(ctx, tournament._id);

    // Merge all organizer IDs and player IDs into one set
    const allTournamentUserIds = new Set([
      ...tournament.organizerUserIds,
      ...competitorUserIds,
    ]);

    // If the set contains both user IDs, they were at the same tournament
    return allTournamentUserIds.has(args.evaluatingUserId) && allTournamentUserIds.has(args.queryingUserId);
  });
};
