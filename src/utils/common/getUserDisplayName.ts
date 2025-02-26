import { User } from '~/api';

export const getUserDisplayName = (userProfile: User | undefined): string => {
  if (!userProfile) {
    return 'Unknown User';
  }

  if (userProfile.givenName && !userProfile.familyName) {
    return userProfile.givenName;
  }

  if (userProfile.givenName && userProfile.familyName) {
    return `${userProfile.givenName} ${userProfile.familyName}`;
  }

  return userProfile?.username || 'Unknown User';
};
