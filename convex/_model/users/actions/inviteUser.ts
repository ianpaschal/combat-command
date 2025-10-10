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
import { VisibilityLevel } from '../../common/VisibilityLevel';
import { createClaimToken } from '../_helpers/createClaimToken';
import { hashClaimToken } from '../_helpers/hashClaimToken';

export const inviteUserArgs = v.object({
  familyName: v.string(),
  givenName: v.string(),
  email: v.string(),
  claimUrl: v.string(),
  subject: v.optional(v.string()),
  header: v.optional(v.string()),
});

export const inviteUser = async (
  ctx: ActionCtx,
  args: Infer<typeof inviteUserArgs>,
): Promise<Doc<'users'>> => {
  const { subject, header, claimUrl, email, ...restArgs } = args;

  // --- CHECK AUTH ----
  await checkAuth(ctx);

  // --- VALIDATE ----
  const existingUser = await ctx.runQuery(internal.users.getUserByEmail, { email });

  // If the user already exists and is not available to claim, skip the process entirely:
  if (existingUser && !existingUser.claimTokenHash) {
    return existingUser;
  }

  // --- PRIMARY ACTIONS ----
  // Create a random secret:
  const claimToken = createClaimToken(32);

  // Provision a user if there is not an existing one:
  let user: Doc<'users'>;
  if (existingUser) {
    await ctx.runMutation(internal.users.updateUserClaimToken, {
      userId: existingUser._id,
      claimToken,
    });
    user = existingUser;
  } else {
    const { user: createdUser } = await createAccount(ctx, {
      provider: 'password',
      account: { id: email },
      profile: {
        ...restArgs,
        email,
        locationVisibility: VisibilityLevel.Hidden,
        nameVisibility: VisibilityLevel.Tournaments,
        claimTokenHash: await hashClaimToken(claimToken),
      },
    });
    user = createdUser;
  }

  // Send invitation email:
  const resend = new Resend(process.env.AUTH_RESEND_KEY!);
  const { error } = await resend.emails.send({
    from: 'CombatCommand <noreply@combatcommand.net>',
    to: args.email,
    subject: subject ?? 'You\'ve been added on Combat Command',
    react: InviteUserEmail({
      url: `${claimUrl}?email=${args.email}&claimToken=${claimToken}`,
      title: header ?? 'You\'ve been added on Combat Command',
    }),
  });
  if (error) {
    console.error(error);
    throw new ConvexError(getErrorMessage('PASSWORD_RESET_FAILED_TO_SEND'));
  }

  return user;
};
