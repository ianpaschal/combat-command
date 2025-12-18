import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { refreshLeagueRanking } from '../../leagueRankings';
import { calculateRankings } from '../_helpers/calculateRankings';

export const refreshLeagueRankingsArgs = v.object({
  leagueId: v.id('leagues'),
});

export const refreshLeagueRankings = async (
  ctx: MutationCtx,
  args: Infer<typeof refreshLeagueRankingsArgs>,
): Promise<void> => {
  const league = await ctx.db.get(args.leagueId);
  if (!league) {
    throw new ConvexError(getErrorMessage('LEAGUE_NOT_FOUND'));
  }
  const rankings = await calculateRankings(ctx, league);
  for (const ranking of rankings) {
    await refreshLeagueRanking(ctx, ranking);
  }
  await ctx.db.patch(args.leagueId, {
    refreshedAt: Date.now(),
  });
};
