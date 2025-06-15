import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { deepenMatchResult, DeepMatchResult } from '../_helpers/deepenMatchResult';

export const getMatchResultArgs = v.object({
  id: v.id('matchResults'),
});

/**
 * Gets a match result by ID.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.id - ID of the match result
 * @returns - A deep match result if found, otherwise null
 */
export const getMatchResult = async (
  ctx: QueryCtx,
  args: Infer<typeof getMatchResultArgs>,
): Promise<DeepMatchResult | null> => {
  const matchResult = await ctx.db.get(args.id);
  if (!matchResult) {
    return null;
  }
  return await deepenMatchResult(ctx, matchResult);
};
