import { Password } from '@convex-dev/auth/providers/Password';
import { convexAuth } from '@convex-dev/auth/server';

import { DataModel } from './_generated/dataModel';
import { UserDataVisibilityLevel } from './common/userDataVisibilityLevel';

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password<DataModel>({
      profile(params) {
        return {
          email: params.email as string,
          username: params.username as string,
          givenName: params.givenName as string,
          familyName: params.familyName as string,
          locationVisibility: params.locationVisibility as UserDataVisibilityLevel,
          nameVisibility: params.nameVisibility as UserDataVisibilityLevel,
        };
      },
    }),
  ],
});
