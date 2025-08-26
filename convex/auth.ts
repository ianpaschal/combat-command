import { Password } from '@convex-dev/auth/providers/Password';
import { convexAuth } from '@convex-dev/auth/server';

import { api } from './_generated/api';
import { MutationCtx } from './_generated/server';
import { ResendOtpPasswordReset } from './auth/ResendOtpPasswordReset';
import { UserDataVisibilityLevel } from './common/userDataVisibilityLevel';

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        return {
          email: params.email as string,
          username: params.username as string,
          givenName: params.givenName as string,
          familyName: params.familyName as string,
          locationVisibility: params.locationVisibility as UserDataVisibilityLevel,
          nameVisibility: params.nameVisibility as UserDataVisibilityLevel,
          emailVerificationTime: params.emailVerificationTime as number,
        };
      },
      reset: ResendOtpPasswordReset,
    }),
  ],
  callbacks: {
    afterUserCreatedOrUpdated: async (ctx: MutationCtx, { userId }) => {
      // Use scheduler so that we can trigger an action rather than a mutation:
      await ctx.scheduler.runAfter(0, api.users.setUserDefaultAvatar, {
        userId,
      });
    },
  },
});
