import { modifyAccountCredentials } from '@convex-dev/auth/server';
import { Infer, v } from 'convex/values';

import { api } from '../../../_generated/api';
import { ActionCtx } from '../../../_generated/server';

export const acceptInvitationArgs = v.object({
  token: v.string(),
  password: v.string(),
});

export const acceptInvitation = async (
  ctx: ActionCtx,
  args: Infer<typeof acceptInvitationArgs>,
): Promise<void> => {
  const invitation = await ctx.runQuery(api.invitations.getInvitationByToken, {
    token: args.token,
  });
  await modifyAccountCredentials(ctx, {
    provider: 'password',
    account: { id: invitation.email, secret: args.password },
  });
  await ctx.runMutation(api.invitations.cleanUpInvitationsByInvitedUser, {
    userId: invitation.invitedUserId,
  });
};
