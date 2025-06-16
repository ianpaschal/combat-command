import { Infer,v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenMatchResultComment,DeepMatchResultComment } from '../_helpers/deepenMatchResultComment';

export const getMatchResultCommentsByUserArgs = v.object({
  userId: v.id('users'),
});

export const getMatchResultCommentsByUser = async (
  ctx: QueryCtx,
  args: Infer<typeof getMatchResultCommentsByUserArgs>,
): Promise<DeepMatchResultComment[]> => {
  const matchResultComments = await ctx.db.query('matchResultComments')
    .withIndex('by_user_id', ((q) => q.eq('userId', args.userId)))
    .order('desc')
    .collect();
  return await Promise.all(matchResultComments.map(
    async (item) => await deepenMatchResultComment(ctx, item),
  ));
};
