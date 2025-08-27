import { convexAuth } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';
import { Resend } from 'resend';

import { api } from './_generated/api';
import { Doc } from './_generated/dataModel';
import { MutationCtx } from './_generated/server';
import { generateUsername } from './_model/users/_helpers/generateUsername';
import CustomPassword from './auth/CustomPassword';
import { getErrorMessage } from './common/errors';
import { UserDataVisibilityLevel } from './common/userDataVisibilityLevel';

type Profile = Partial<{
  claimTokenHash: string;
  email: string;
  emailVerificationTime: number;
  familyName: string;
  givenName: string;
  locationVisibility: UserDataVisibilityLevel;
  nameVisibility: UserDataVisibilityLevel;
  username: string;
}>;

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [CustomPassword],
  callbacks: {
    createOrUpdateUser: async (ctx: MutationCtx, args) => {
      // If user already exists, do nothing:
      if (args.existingUserId) {
        return args.existingUserId;
      }

      const profile = args.profile as Profile;

      // If a username was provided, check it, otherwise try to generate a new unique username:
      let username = profile.username;
      if (username?.length) {
        const existing = await ctx.db.query('users')
          .withIndex('by_username', (q) => q.eq('username', username!))
          .first();
        if (existing) {
          throw new ConvexError(getErrorMessage('USERNAME_ALREADY_EXISTS'));
        }
      } else {
        let existing: Doc<'users'> | null;
        do {
          username = generateUsername();
          existing = await ctx.db.query('users')
            .withIndex('by_username', (q) => q.eq('username', username!))
            .first();
        } while (existing);
      }
  
      // Update the email address in Resend:
      const email = args.profile.email;
      if (!email) {
        throw new ConvexError(getErrorMessage('EMAIL_REQUIRED_FOR_REGISTRATION'));
      }
      new Resend(process.env.AUTH_RESEND_KEY!).contacts.create({
        email,
        firstName: profile.givenName ?? '',
        lastName: profile.familyName ?? '',
        unsubscribed: false,
        audienceId: 'bfe8504e-9cfa-4986-a533-4e1e39a40a0e',
      });

      // Create the user:
      return await ctx.db.insert('users', {
        ...args.profile,
        email,
        username,
      });
    },
    afterUserCreatedOrUpdated: async (ctx: MutationCtx, { userId }) => {
      // Use scheduler so that we can trigger an action rather than a mutation:
      await ctx.scheduler.runAfter(0, api.users.setUserDefaultAvatar, {
        userId,
      });
    },
  },
});
