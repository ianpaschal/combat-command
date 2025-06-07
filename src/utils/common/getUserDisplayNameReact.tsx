import { ReactNode } from 'react';

import { User } from '~/api';

export const getUserDisplayNameReact = (userProfile?: User): ReactNode => {
  if (!userProfile) {
    return 'Unknown User';
  }

  if (userProfile.givenName && !userProfile.familyName) {
    return <span>{userProfile.givenName}</span>;
  }

  if (userProfile.givenName && userProfile.familyName) {
    return (
      <>
        <span>{userProfile.givenName}</span>
        <span>{userProfile.familyName}</span>
      </>
    );
  }

  return <span>{userProfile?.username || 'Unknown User'}</span>;
};
