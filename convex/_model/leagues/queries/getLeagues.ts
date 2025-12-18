import { QueryCtx } from '../../../_generated/server';
import { notNullOrUndefined } from '../../common/_helpers/notNullOrUndefined';
import { checkLeagueVisibility } from '../_helpers/checkLeagueVisibility';
import { deepenLeague } from '../_helpers/deepenLeague';
import { League } from '../types';

/**
 * Gets an array of deep Leagues.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.startsAfter - Filter for leagues starting after this date
 * @returns An array of deep Leagues
 */
export const getLeagues = async (
  ctx: QueryCtx,
): Promise<League[]> => {
  const leagues = await ctx.db.query('leagues').order('desc').collect();
  const deepLeagues = await Promise.all(leagues.map(async (league) => {
    if (await checkLeagueVisibility(ctx, league)) {
      return await deepenLeague(ctx, league, 3);
    }
    return null;
  }));
  return deepLeagues.filter(notNullOrUndefined);
};
