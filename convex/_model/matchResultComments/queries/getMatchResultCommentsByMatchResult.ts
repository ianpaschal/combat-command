import { Infer,v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenMatchResultComment,DeepMatchResultComment } from '../_helpers/deepenMatchResultComment';

export const getMatchResultCommentsByMatchResultArgs = v.object({
  matchResultId: v.id('matchResults'),
});

export const getMatchResultCommentsByMatchResult = async (
  ctx: QueryCtx,
  args: Infer<typeof getMatchResultCommentsByMatchResultArgs>,
): Promise<DeepMatchResultComment[]> => {
  const matchResultComments = await ctx.db.query('matchResultComments')
    .withIndex('by_match_result_id', ((q) => q.eq('matchResultId', args.matchResultId)))
    .order('desc')
    .collect();
  return await Promise.all(matchResultComments.map(
    async (item) => await deepenMatchResultComment(ctx, item),
  ));
};
