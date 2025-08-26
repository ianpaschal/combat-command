import { Infer, v } from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { randomHex } from '../_helpers/randomHex';
import { sha256Hex } from '../_helpers/sha256Hex';

export const createInvitationArgs = v.object({
  email: v.string(),
  givenName: v.string(),
  familyName: v.string(),
});

/**
 * 
 * @param ctx 
 * @param args 
 * @returns - The generated invitation token
 */
export const createInvitation = async (
  ctx: MutationCtx,
  args: Infer<typeof createInvitationArgs>,
): Promise<string> => {
  const userId = await checkAuth(ctx);

  // Provision a user:
  const invitedUserId = await ctx.db.insert('users', {
    email: args.email,
    givenName: args.givenName,
    familyName: args.familyName,
    locationVisibility: 'hidden',
    nameVisibility: 'tournaments',
  });

  // Create a random secret:
  const token = randomHex(32);
  const secret = await sha256Hex(token);

  // Create the invitation:
  await ctx.db.insert('invitations', {
    email: args.email,
    invitedByUserId: userId,
    invitedUserId,
    secret,
  });

  return token;
};
