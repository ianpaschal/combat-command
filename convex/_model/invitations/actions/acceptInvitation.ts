import { modifyAccountCredentials } from '@convex-dev/auth/server';
import { Infer, v } from 'convex/values';

import { internal } from '../../../_generated/api';
import { Doc } from '../../../_generated/dataModel';
import { ActionCtx } from '../../../_generated/server';

export const acceptInvitationArgs = v.object({
  token: v.string(),
  password: v.string(),
});

export const acceptInvitation = async (
  ctx: ActionCtx,
  args: Infer<typeof acceptInvitationArgs>,
): Promise<void> => {
  const invitation: Doc<'invitations'> = await ctx.runQuery(internal.invitations.getInvitationByToken, {
    token: args.token,
  });
  await modifyAccountCredentials(ctx, {
    provider: 'password',
    account: { id: invitation.email, secret: args.password },
  });
  await ctx.runMutation(internal.invitations.cleanUpInvitationsByInvitedUser, {
    userId: invitation.userId,
  });
};
