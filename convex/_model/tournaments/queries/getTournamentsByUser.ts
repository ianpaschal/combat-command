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

  const tournamentRegistrations = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_user', (q) => q.eq('userId', args.userId))
    .collect();
  const tournamentOrganizers = await ctx.db.query('tournamentOrganizers')
    .withIndex('by_user', (q) => q.eq('userId', args.userId))
    .collect();

  const tournamentIds = new Set([
    ...tournamentRegistrations.map((r) => r.tournamentId),
    ...tournamentOrganizers.map((r) => r.tournamentId),
  ]);
  const deepTournaments = await Promise.all([...tournamentIds].map(async (id) => {
    const tournament = await ctx.db.get(id);
    if (tournament && await checkTournamentVisibility(ctx, tournament)) {
      return await deepenTournament(ctx, tournament);
    }
    return null;
  }));
  return deepTournaments.filter((tournament): tournament is TournamentDeep => {
    if (!notNullOrUndefined(tournament)) {
      return false;
    }
    if (args.status && tournament.status !== args.status) {
      return false;
    }
    return true;
  });
};
