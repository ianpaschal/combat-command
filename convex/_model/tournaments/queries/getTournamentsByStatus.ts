import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { tournamentStatus } from '../../../common/tournamentStatus';
import { notNullOrUndefined } from '../../common/_helpers/notNullOrUndefined';
import { checkTournamentVisibility } from '../_helpers/checkTournamentVisibility';
import { deepenTournament, TournamentDeep } from '../_helpers/deepenTournament';

export const getTournamentsByStatusArgs = v.object({
  status: tournamentStatus,
});

/**
 * Gets an array of deep Tournaments with a given status.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.status - Tournament status to filter by
 * @returns An array of deep Tournaments
 */
export const getTournamentsByStatus = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentsByStatusArgs>,
): Promise<TournamentDeep[]> => {
  const tournaments = await ctx.db.query('tournaments')
    .withIndex('by_status_starts_at', ((q) => q.eq('status', args.status)))
    .order(args.status === 'archived' ? 'desc' : 'asc')
    .collect();
  const deepTournaments = await Promise.all(
    tournaments.map(async (tournament) => {
      if (await checkTournamentVisibility(ctx, tournament)) {
        return await deepenTournament(ctx, tournament);
      }
      return null;
    }),
  );
  return deepTournaments.filter(notNullOrUndefined);
};
