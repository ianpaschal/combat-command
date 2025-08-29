import { Email } from '@convex-dev/auth/providers/Email';
import { Password } from '@convex-dev/auth/providers/Password';
import { convexAuth } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { Resend } from 'resend';

import { internal } from './_generated/api';
import { DataModel, Doc } from './_generated/dataModel';
import { MutationCtx } from './_generated/server';
import { getEnvironment } from './_model/common/_helpers/getEnvironment';
import { getErrorMessage } from './_model/common/errors';
import { UserDataVisibilityLevel } from './_model/common/userDataVisibilityLevel';
import { generateUsername } from './_model/users/_helpers/generateUsername';
import { PasswordResetEmail } from './emails/PasswordResetEmail';

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
  providers: [Password<DataModel>({
    profile(params) {
      return {
        email: params.email as string,
        username: params.username as string,
        givenName: params.givenName as string,
        familyName: params.familyName as string,
        locationVisibility: params.locationVisibility as UserDataVisibilityLevel,
        nameVisibility: params.nameVisibility as UserDataVisibilityLevel,
        emailVerificationTime: params.emailVerificationTime as number,
        claimTokenHash: params.claimTokenHash as string,
      };
    },
    // verify: Email, // TODO: Add email verification
    reset: Email({
      id: 'resend-otp-password-reset',
      apiKey: process.env.AUTH_RESEND_KEY,
      maxAge: 60 * 15, // 15 minutes
      async generateVerificationToken() {
        return generateRandomString(6, alphabet('0-9'));
      },
      async sendVerificationRequest(params) {
        const resend = new Resend(params.provider.apiKey);
        const { error } = await resend.emails.send({
          from: 'CombatCommand <noreply@combatcommand.net>',
          to: [params.identifier],
          subject: 'Password Reset Code',
          react: PasswordResetEmail(params),
        });
        if (error) {
          console.error(error);
          throw new ConvexError(getErrorMessage('PASSWORD_RESET_FAILED_TO_SEND'));
        }
      },
    }),
  })],
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

      // Create the user:
      const email = args.profile.email;
      if (!email) {
        throw new ConvexError(getErrorMessage('EMAIL_REQUIRED_FOR_REGISTRATION'));
      }
      const userId = await ctx.db.insert('users', {
        ...args.profile,
        email,
        username,
      });

      // Use schedulers so that we can trigger actions rather than a mutations...

      // Update the email address in Resend:
      if (getEnvironment()?.env === 'prod') {
        await ctx.scheduler.runAfter(0, internal.users.addContactToResend, {
          email,
          firstName: profile.givenName,
          lastName: profile.familyName,
        });
      }

      // Set a default avatar:
      await ctx.scheduler.runAfter(0, internal.users.setUserDefaultAvatar, {
        userId,
      });

      return userId;
    },
  },
});
