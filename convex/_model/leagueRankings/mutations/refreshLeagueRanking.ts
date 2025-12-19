import { Infer, v } from 'convex/values';

import { Id } from '../../../_generated/dataModel';
import { MutationCtx } from '../../../_generated/server';
import { editableFields } from '../table';

export const refreshLeagueRankingArgs = v.object({
  ...editableFields,
});

export const refreshLeagueRanking = async (
  ctx: MutationCtx,
  args: Infer<typeof refreshLeagueRankingArgs>,
): Promise<Id<'leagueRankings'>> => {
  const { userId, leagueId, ...restArgs } = args;
  const leagueRanking = await ctx.db.query('leagueRankings')
    .withIndex('by_league_user', (q) => q.eq('leagueId', leagueId).eq('userId', userId))
    .first();

  if (leagueRanking) {
    await ctx.db.patch(leagueRanking._id, {
      ...restArgs,
      modifiedAt: Date.now(),
    });
    return leagueRanking._id;
  }
  
  return await ctx.db.insert('leagueRankings', args);
};
