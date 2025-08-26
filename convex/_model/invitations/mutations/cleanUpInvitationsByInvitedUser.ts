import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { checkAuth } from '../../common/_helpers/checkAuth';

export const cleanUpInvitationsByInvitedUserArgs = v.object({
  userId: v.id('users'),
});

export const cleanUpInvitationsByInvitedUser = async (
  ctx: MutationCtx,
  args: Infer<typeof cleanUpInvitationsByInvitedUserArgs>,
): Promise<void> => {
  const userId = await checkAuth(ctx);
  if (userId !== args.userId) {
    throw new ConvexError(getErrorMessage('USER_DOES_NOT_HAVE_PERMISSION'));
  }
  const invitations = await ctx.db.query('invitations')
    .withIndex('by_user', (q) => q.eq('userId', args.userId))
    .collect();
  for (const invitation of invitations) {
    await ctx.db.delete(invitation._id);
  }
};
