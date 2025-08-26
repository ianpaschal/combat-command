import { Infer, v } from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { checkAuth } from '../../common/_helpers/checkAuth';

export const deleteInvitationArgs = v.object({
  id: v.id('invitations'),
});

export const deleteInvitation = async (
  ctx: MutationCtx,
  args: Infer<typeof deleteInvitationArgs>,
): Promise<void> => {
  const userId = await checkAuth(ctx);
  const invitation = await ctx.db.get(args.id);
  if (!invitation || !userId) {
    throw new Error('Unauthorized');
  }
  await ctx.db.delete(args.id);
};
