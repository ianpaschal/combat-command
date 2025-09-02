import { Infer, v } from 'convex/values';

import { Id } from '../../../_generated/dataModel';
import { MutationCtx } from '../../../_generated/server';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { editableFields } from '../table';

export const toggleMatchResultLikeArgs = v.object({
  ...editableFields,
});

export const toggleMatchResultLike = async (
  ctx: MutationCtx,
  args: Infer<typeof toggleMatchResultLikeArgs>,
): Promise<Id<'matchResultLikes'> | void> => {
  const userId = await checkAuth(ctx);
  const matchResult = await ctx.db.get(args.matchResultId);
  if (!matchResult) {
    throw 'Match result not found.';
  }
  const matchResultLike = await ctx.db.query('matchResultLikes').withIndex(
    'by_user_id_match_result_id',
    ((q) => q.eq('userId', userId).eq('matchResultId', args.matchResultId)),
  ).first();
  if (matchResultLike) {
    return await ctx.db.delete(matchResultLike._id);
  }
  return await ctx.db.insert('matchResultLikes', {
    ...args,
    userId,
  });
};
