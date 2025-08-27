import { Password } from '@convex-dev/auth/providers/Password';

import { DataModel } from '../_generated/dataModel';
import { UserDataVisibilityLevel } from '../_model/common/userDataVisibilityLevel';
import { ResendOtpPasswordReset } from './ResendOtpPasswordReset';
 
export default Password<DataModel>({
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
  reset: ResendOtpPasswordReset,
});
