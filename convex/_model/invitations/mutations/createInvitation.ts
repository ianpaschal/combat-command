import { getAuthUserId } from '@convex-dev/auth/server';
import { Infer, v } from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { randomHex } from '../_helpers/randomHex';

export const createInvitationArgs = v.object({
  email: v.string(),
  givenName: v.string(),
  familyName: v.string(),
});

export const createInvitation = async (
  ctx: MutationCtx,
  args: Infer<typeof createInvitationArgs>,
): Promise<string> => {
  const userId = await getAuthUserId(ctx);
  if (!ctx.auth || !userId) {
    throw new Error('Unauthorized');
  }

  // pre-provision user
  const shadowUserId = await ctx.db.insert('users', {
    email: args.email,
    givenName: args.givenName,
    familyName: args.familyName,
    locationVisibility: 'hidden',
    nameVisibility: 'tournaments',
  });

  // random secret
  const token = randomHex(32);
  await ctx.db.insert('invitations', {
    email: args.email,
    invitedByUserId: userId,
    invitedUserId: shadowUserId,
    tokenHash: token,
  });

  return token;
};
