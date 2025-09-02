import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../../_generated/server';
import { checkAuth } from '../../../common/_helpers/checkAuth';
import { getErrorMessage } from '../../../common/errors';
import { hashClaimToken } from '../../_helpers/hashClaimToken';

export const updateUserClaimTokenArgs = v.object({
  userId: v.id('users'),
  claimToken: v.string(),
});

export const updateUserClaimToken = async (
  ctx: MutationCtx,
  args: Infer<typeof updateUserClaimTokenArgs>,
): Promise<void> => {
  // --- CHECK AUTH ----
  const userId = await checkAuth(ctx);
  if (userId !== args.userId) {
    throw new ConvexError(getErrorMessage('USER_DOES_NOT_HAVE_PERMISSION'));
  }

  // ---- PRIMARY ACTIONS ----
  await ctx.db.patch(args.userId, {
    claimTokenHash: await hashClaimToken(args.claimToken),
  });
};
