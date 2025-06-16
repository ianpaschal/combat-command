import { Infer,v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenMatchResultLike,DeepMatchResultLike } from '../_helpers/deepenMatchResultLike';

export const getMatchResultLikeArgs = v.object({
  id: v.id('matchResultLikes'),
});

export const getMatchResultLike = async (
  ctx: QueryCtx,
  args: Infer<typeof getMatchResultLikeArgs>,
): Promise<DeepMatchResultLike | null> => {
  const matchResultLike = await ctx.db.get(args.id);
  if (!matchResultLike) {
    return null;
  }
  return await deepenMatchResultLike(ctx, matchResultLike);
};
