import { Infer,v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenMatchResultLike,DeepMatchResultLike } from '../_helpers/deepenMatchResultLike';

export const getMatchResultLikesByUserArgs = v.object({
  userId: v.id('users'),
});

export const getMatchResultLikesByUser = async (
  ctx: QueryCtx,
  args: Infer<typeof getMatchResultLikesByUserArgs>,
): Promise<DeepMatchResultLike[]> => {
  const matchResultLikes = await ctx.db.query('matchResultLikes')
    .withIndex('by_user_id', ((q) => q.eq('userId', args.userId)))
    .order('desc')
    .collect();
  return await Promise.all(matchResultLikes.map(
    async (item) => await deepenMatchResultLike(ctx, item),
  ));
};
