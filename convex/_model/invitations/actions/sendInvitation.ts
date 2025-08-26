import { Infer, v } from 'convex/values';
import { Resend } from 'resend';

import { api } from '../../../_generated/api';
import { ActionCtx } from '../../../_generated/server';
import { InviteUser } from '../../../emails/InviteUser';

export const sendInvitationArgs = v.object({
  email: v.string(),
  givenName: v.string(),
  familyName: v.string(),
});

export const sendInvitation = async (
  ctx: ActionCtx,
  args: Infer<typeof sendInvitationArgs>,
): Promise<void> => {
  const token = await ctx.runMutation(api.invitations.createInvitation, args);
  const resend = new Resend(process.env.AUTH_RESEND_KEY!);
  await resend.emails.send({
    from: 'invites@yourapp.com',
    to: args.email,
    subject: 'You\'re invited!',
    react: InviteUser({
      url: `${process.env.APP_URL}/invite?token=${token}`,
    }),
  });
};
