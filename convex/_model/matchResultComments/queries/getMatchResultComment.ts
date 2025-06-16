import { Infer,v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenMatchResultComment,DeepMatchResultComment } from '../_helpers/deepenMatchResultComment';

export const getMatchResultCommentArgs = v.object({
  id: v.id('matchResultComments'),
});

export const getMatchResultComment = async (
  ctx: QueryCtx,
  args: Infer<typeof getMatchResultCommentArgs>,
): Promise<DeepMatchResultComment | null> => {
  const matchResultComment = await ctx.db.get(args.id);
  if (!matchResultComment) {
    return null;
  }
  return await deepenMatchResultComment(ctx, matchResultComment);
};
