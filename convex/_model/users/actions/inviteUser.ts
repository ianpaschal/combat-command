import { createAccount } from '@convex-dev/auth/server';
import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';
import { Resend } from 'resend';

import { internal } from '../../../_generated/api';
import { Doc } from '../../../_generated/dataModel';
import { ActionCtx } from '../../../_generated/server';
import { InviteUserEmail } from '../../../emails/InviteUserEmail';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { getErrorMessage } from '../../common/errors';
import { createClaimToken } from '../_helpers/createClaimToken';
import { hashClaimToken } from '../_helpers/hashClaimToken';

export const inviteUserArgs = v.object({
  familyName: v.string(),
  givenName: v.string(),
  email: v.string(),
  subject: v.optional(v.string()),
  header: v.optional(v.string()),
});

export const inviteUser = async (
  ctx: ActionCtx,
  args: Infer<typeof inviteUserArgs>,
): Promise<Doc<'users'>> => {
  // --- CHECK AUTH ----
  await checkAuth(ctx);

  const existingUser = await ctx.runQuery(internal.users.getUserByEmail, {
    email: args.email,
  });

  // --- PRIMARY ACTIONS ----
  // Create a random secret:
  const claimToken = createClaimToken(32);

  const { subject, header, ...restArgs } = args;
  
  // Provision a user if there is not an existing one:
  const user = existingUser ?? (await createAccount(ctx, {
    provider: 'password',
    account: { id: args.email },
    profile: {
      ...restArgs,
      locationVisibility: 'hidden',
      nameVisibility: 'tournaments',
      claimTokenHash: await hashClaimToken(claimToken),
    },
  }))?.user;
  if (!user) {
    throw new ConvexError(getErrorMessage('USER_NOT_FOUND'));
  }

  // If there was no existing user, or it has an outstanding claim token, send email:
  const userIsClaimed = existingUser && !existingUser.claimTokenHash;
  if (!userIsClaimed) {
    const resend = new Resend(process.env.AUTH_RESEND_KEY!);
    const { error } = await resend.emails.send({
      from: 'CombatCommand <noreply@combatcommand.net>',
      to: args.email,
      subject: subject ?? 'You\'ve been added on Combat Command',
      react: InviteUserEmail({
        url: `${process.env.APP_URL}/claim?email=${args.email}&claimToken=${claimToken}`,
        title: header ?? '',
      }),
    });
    if (error) {
      console.error(error);
      throw new ConvexError(getErrorMessage('PASSWORD_RESET_FAILED_TO_SEND'));
    }
  }

  return user;
};
