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
import { getErrorMessage } from '../../../common/errors';
import { InviteUserViaTournament } from '../../../emails/InviteUserViaTournament';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { editableFields } from '../../users/fields';
import { randomHex } from '../_helpers/randomHex';
import { sha256Hex } from '../_helpers/sha256Hex';

export const inviteUserArgs = v.object({
  ...editableFields,
  subject: v.optional(v.string()),
  header: v.optional(v.string()),
});

export const inviteUser = async (
  ctx: ActionCtx,
  args: Infer<typeof inviteUserArgs>,
): Promise<Doc<'users'>> => {
  const resend = new Resend(process.env.AUTH_RESEND_KEY!);

  // --- CHECK AUTH ----
  await checkAuth(ctx);

  const existingUser = await ctx.runQuery(internal.users.getUserByEmailInternal, {
    email: args.email,
  });

  // --- PRIMARY ACTIONS ----
  // Create a random secret:
  const token = randomHex(32);
  
  // Provision a user if there is not an existing one:
  const user = existingUser ?? (await createAccount(ctx, {
    provider: 'password',
    account: { id: args.email },
    profile: {
      email: args.email,
      givenName: args.givenName,
      familyName: args.familyName,
      locationVisibility: 'hidden',
      nameVisibility: 'tournaments',
      claimTokenHash: await sha256Hex(token),
    },
  }))?.user;
  if (!user) {
    throw new ConvexError(getErrorMessage('FILE_NOT_FOUND'));
  }

  // If there was no existing user, or it has an outstanding claim token, send email:
  if (!existingUser || !!existingUser?.claimTokenHash) {
    await resend.emails.send({
      from: 'CombatCommand <noreply@combatcommand.net>',
      to: args.email,
      subject: args.subject ?? 'You\'ve been added on Combat Command',
      react: InviteUserViaTournament({
        url: `${process.env.APP_URL}/invite?token=${token}`,
        title: args.header ?? '',
      }),
    });
  }

  return user;
};
