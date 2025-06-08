import { QueryCtx } from '../../../_generated/server';
import { notNullOrUndefined } from '../../_helpers/notNullOrUndefined';
import { checkTournamentVisibility } from '../_helpers/checkTournamentVisibility';
import { deepenTournament, TournamentDeep } from '../_helpers/deepenTournament';

/**
 * Gets an array of ALL deep Tournaments.
 * 
 * @param ctx - Convex query context
 * @returns An array of deep Tournaments
 */
export const getTournaments = async (
  ctx: QueryCtx,
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
  return deepTournaments.filter(notNullOrUndefined);
};
