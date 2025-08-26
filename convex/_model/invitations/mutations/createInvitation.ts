import { Infer, v } from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { randomHex } from '../_helpers/randomHex';
import { sha256Hex } from '../_helpers/sha256Hex';

export const createInvitationArgs = v.object({
  userId: v.id('users'),
  email: v.string(),
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
  // --- CHECK AUTH ----
  const userId = await checkAuth(ctx);

  // --- PRIMARY ACTIONS ----
  // Create a random secret:
  const token = randomHex(32);
  const secret = await sha256Hex(token);

  // Create the invitation:
  await ctx.db.insert('invitations', {
    ...args,
    invitedByUserId: userId,
    secret,
  });

  return token;
};
