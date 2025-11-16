import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { checkListVisibility } from '../_helpers/checkListVisibility';
import { deepenList, DeepList } from '../_helpers/deepenList';

export const getListArgs = v.object({
  id: v.id('lists'),
});

/**
 * Gets a list by ID.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.id - ID of the list
 * @returns - A deepened list if found, otherwise null
 */
export const getList = async (
  ctx: QueryCtx,
  args: Infer<typeof getListArgs>,
): Promise<DeepList | null> => {
  const result = await ctx.db.get(args.id);
  if (!result) {
    return null;
  }
  if (await checkListVisibility(ctx, result)) {
    return await deepenList(ctx, result);
  }
  return null;
};
