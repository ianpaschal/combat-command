import { QueryCtx } from '../../../_generated/server';
import { deepenMatchResult, DeepMatchResult } from '../_helpers/deepenMatchResult';

export const getMatchResults = async (
  ctx: QueryCtx,
): Promise<DeepMatchResult[]> => {
  const matchResults = await ctx.db.query('matchResults').collect();
  return await Promise.all(matchResults.map(
    async (item) => await deepenMatchResult(ctx, item),
  ));
};
