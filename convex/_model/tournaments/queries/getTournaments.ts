import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { notNullOrUndefined } from '../../common/_helpers/notNullOrUndefined';
import { checkTournamentVisibility } from '../_helpers/checkTournamentVisibility';
import { deepenTournament, TournamentDeep } from '../_helpers/deepenTournament';

export const getTournamentsArgs = v.object({
  startsAfter: v.optional(v.union(v.string(), v.number())),
});

/**
 * Gets an array of ALL deep Tournaments.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.startsAfter - Filter for tournaments starting after this date
 * @returns An array of deep Tournaments
 */
export const getTournaments = async (
  ctx: QueryCtx,
  args: Infer<typeof getTournamentsArgs>,
): Promise<TournamentDeep[]> => {

  const tournaments = await ctx.db.query('tournaments')
    .withIndex('by_starts_at')
    .order('asc')
    .collect();
  const deepTournaments = await Promise.all(
    tournaments.filter((tournament) => {
      if (args.startsAfter) {
        const startsAfter = typeof args.startsAfter === 'string' ? Date.parse(args.startsAfter) : args.startsAfter;
        if (Date.parse(tournament.startsAt) < startsAfter) {
          return false;
        }
      }
      return true;
    }).map(async (tournament) => {
      if (await checkTournamentVisibility(ctx, tournament)) {
        return await deepenTournament(ctx, tournament);
      }
      return null;
    }),
  );
  return deepTournaments.filter(notNullOrUndefined);
};
