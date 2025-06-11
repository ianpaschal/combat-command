import { Infer, v } from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { checkMatchResultAuth } from '../_helpers/checkMatchResultAuth';
import { getShallowMatchResult } from '../_helpers/getShallowMatchResult';

export const deleteMatchResultArgs = v.object({
  id: v.id('matchResults'),
});

/**
 * Deletes a match result.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.id - ID of the MatchResult
 */
export const deleteMatchResult = async (
  ctx: MutationCtx,
  args: Infer<typeof deleteMatchResultArgs>,
): Promise<void> => {
  // --- CHECK AUTH ----
  const userId = await checkAuth(ctx);
  const matchResult = await getShallowMatchResult(ctx, args.id);
  checkMatchResultAuth(ctx, userId, matchResult);

  // ---- PRIMARY ACTIONS ----
  // Delete the match result:
  await ctx.db.delete(args.id);
};
