import { getAuthUserId } from '@convex-dev/auth/server';
import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { api } from '../../../_generated/api';
import { Id } from '../../../_generated/dataModel';
import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { generateUsername } from '../_helpers/generateUsername';
import { editableFields } from '../fields';
import { getUserByEmail } from '../queries/getUserByEmail';

export const createUserArgs = v.object({
  ...editableFields,
  tournamentId: v.optional(v.id('tournaments')),
});

/**
 * Creates a new user if one with the given email does not exist.
 * If the user exists and the account does't, an email will be sent to remind the owner to claim it.
 * 
 * @param ctx - Convex query context
 * @param args - User data
 */
export const createUser = async (
  ctx: MutationCtx,
  args: Infer<typeof createUserArgs>,
): Promise<Id<'users'>> => {
  // --- CHECK AUTH ----
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError(getErrorMessage('USER_NOT_AUTHENTICATED'));
  }

  // ---- VALIDATE ----
  // Check if an account with the provided email already exists:
  const account = await ctx.db.query('authAccounts')
    .filter((q) => q.eq(q.field('providerAccountId'), args.email))
    .unique();

  // If it does, skip the invitation process entirely:
  if (account) {
    return account.userId;
  }

  // --- PRIMARY ACTIONS ----
  // Check for an existing user profile (perhaps invite was sent but never accepted):
  const user = await getUserByEmail(ctx, {
    email: args.email,
  });

  // Get a userId, either from the existing user or by creating a new one:
  const createdUserId = user ? user._id : await ctx.db.insert('users', {
    locationVisibility: 'hidden' as const,
    nameVisibility: 'tournaments' as const,
    username: generateUsername(),
    ...args,
  });

  // Always send the invitation. Even if the user is already invited, this serves as a reminder:
  ctx.scheduler.runAfter(0, api.invitations.inviteUser, {
    userId: createdUserId,
    email: args.email,
    tournamentId: args.tournamentId,
  });

  return createdUserId;
};
