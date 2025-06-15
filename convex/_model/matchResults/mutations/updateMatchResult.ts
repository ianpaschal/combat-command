import { Infer, v } from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { checkMatchResultAuth } from '../_helpers/checkMatchResultAuth';
import { getShallowMatchResult } from '../_helpers/getShallowMatchResult';
import { editableFields } from '../fields';

export const updateMatchResultArgs = v.object({
  id: v.id('matchResults'),
  ...editableFields,
});

/**
 * Updates a MatchResult.
 * 
 * @param ctx - Convex query context
 * @param args - MatchResult data
 */
export const updateMatchResult = async (
  ctx: MutationCtx,
  args: Infer<typeof updateMatchResultArgs>,
): Promise<void> => {
  const { id, ...updated } = args;
  
  // --- CHECK AUTH ----
  const userId = await checkAuth(ctx);
  const matchResult = await getShallowMatchResult(ctx, id);
  checkMatchResultAuth(ctx, userId, matchResult);

  // ---- PRIMARY ACTIONS ----
  // TODO: Update confirmations:
  // const confirmations = {
  //   player0Confirmed: false,
  //   player1Confirmed: false,
  // };

  // if((userId === args.player0UserId) || args.player0Placeholder) {
  //   confirmations.player0Confirmed = true;
  // }
  // if((userId === args.player1UserId) || args.player1Placeholder) {
  //   confirmations.player1Confirmed = true;
  // }

  // Update the match result:
  await ctx.db.patch(id, {
    ...updated,
    modifiedAt: Date.now(),
  });
};
