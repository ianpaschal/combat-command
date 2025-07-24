import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { tournamentStatus } from '../../../common/tournamentStatus';
import { notNullOrUndefined } from '../../common/_helpers/notNullOrUndefined';
import { checkTournamentVisibility } from '../_helpers/checkTournamentVisibility';
import { deepenTournament, TournamentDeep } from '../_helpers/deepenTournament';

export const getTournamentsByUserArgs = v.object({
  userId: v.id('users'),
  status: v.optional(tournamentStatus),
});

/**
 * Gets an array of deep tournaments which were attended by a given user.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.status - The user ID to filter by
 * @param args.status - Tournament status to filter by
 * @returns An array of deep tournaments
 */
export const getTournamentsByUser = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentsByUserArgs>,
): Promise<TournamentDeep[]> => {
  const tournaments = await ctx.db.query('tournaments').collect();
  const deepTournaments = await Promise.all(
    tournaments.map(async (tournament) => {
      if (await checkTournamentVisibility(ctx, tournament)) {
        return await deepenTournament(ctx, tournament);
      }
      return null;
    }),
  );
  return deepTournaments.filter((tournament): tournament is TournamentDeep => {
    if (!notNullOrUndefined(tournament)) {
      return false;
    }
    const userIds = [
      ...tournament.organizerUserIds,
      ...tournament.activePlayerUserIds,
    ];
    if (!userIds.includes(args.userId)) {
      return false;
    }
    if (args.status && tournament.status !== args.status) {
      return false;
    }
    return true;
  });
};
