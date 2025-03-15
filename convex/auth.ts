import { Password } from '@convex-dev/auth/providers/Password';
import { convexAuth } from '@convex-dev/auth/server';

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
      // TODO: Uncomment this when the password requirements are implemented
      // validatePasswordRequirements: (password: string) => {
      //   if (
      //     !password ||
      //     password.length < 6 ||
      //     !/\d/.test(password) ||
      //     !/[a-z]/.test(password) ||
      //     !/[A-Z]/.test(password)
      //   ) {
      //     throw new ConvexError(INVALID_PASSWORD);
      //   }
      // },
      reset: ResendOtpPasswordReset,
      // verify: ResendOtpVerification,
    }),
  ],
});
