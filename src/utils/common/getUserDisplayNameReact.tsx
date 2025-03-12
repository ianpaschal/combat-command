import { ReactNode } from 'react';

import { User } from '~/api';

export const getUserDisplayNameReact = (userProfile?: User): ReactNode => {
  if (!userProfile) {
    return 'Unknown User';
  }

  if (userProfile.givenName && !userProfile.familyName) {
    return <>{userProfile.givenName}</>;
  }

  if (userProfile.givenName && userProfile.familyName) {
    return <>{userProfile.givenName} <br /> {userProfile.familyName}</>;
  }

  return <>{userProfile?.username || 'Unknown User'}</>;
};
