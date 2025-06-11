import { Infer,v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenMatchResultLike,DeepMatchResultLike } from '../_helpers/deepenMatchResultLike';

export const getMatchResultLikesByMatchResultArgs = v.object({
  matchResultId: v.id('matchResults'),
});

export const getMatchResultLikesByMatchResult = async (
  ctx: QueryCtx,
  args: Infer<typeof getMatchResultLikesByMatchResultArgs>,
): Promise<DeepMatchResultLike[]> => {
  const matchResultLikes = await ctx.db.query('matchResultLikes')
    .withIndex('by_match_result_id', ((q) => q.eq('matchResultId', args.matchResultId)))
    .order('desc')
    .collect();
  return await Promise.all(matchResultLikes.map(
    async (item) => await deepenMatchResultLike(ctx, item),
  ));
};
