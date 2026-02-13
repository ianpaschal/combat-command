import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { notNullOrUndefined } from '../../common/_helpers/notNullOrUndefined';
import { checkListVisibility } from '../_helpers/checkListVisibility';
import { deepenList, DeepList } from '../_helpers/deepenList';

export const getListsByUserArgs = v.object({
  userId: v.id('users'),
});

export const getListsByUser = async (
  ctx: QueryCtx,
  args: Infer<typeof getListsByUserArgs>,
): Promise<DeepList[]> => {
  const results = await ctx.db.query('lists')
    .withIndex('by_user', (q) => q.eq('userId', args.userId))
    .collect();
  const deepResults = await Promise.all(results.map(async (r) => {
    if (await checkListVisibility(ctx, r)) {
      return await deepenList(ctx, r);
    }
    return null;
  }));
  return deepResults.filter(notNullOrUndefined);
};
