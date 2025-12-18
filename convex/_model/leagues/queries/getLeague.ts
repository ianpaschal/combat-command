import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenLeague } from '../_helpers/deepenLeague';
import { League } from '../types';

export const getLeagueArgs = v.object({
  id: v.id('leagues'),
});

/**
 * Gets a League by ID.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.id - ID of the League
 * @returns - A deep League if found, otherwise null
 */
export const getLeague = async (
  ctx: QueryCtx,
  args: Infer<typeof getLeagueArgs>,
): Promise<League | null> => {
  const league = await ctx.db.get(args.id);
  if (!league) {
    return null;
  }
  return await deepenLeague(ctx, league, 3);
};
