import { UserProfileSecureRow } from '~/types/db';

export const getUserDisplayName = (userProfile: UserProfileSecureRow | undefined): string => {
  if (!userProfile) {
    return 'Unknown User';
  }

  if (userProfile.given_name && !userProfile.family_name) {
    return userProfile.given_name;
  }

  if (userProfile.given_name && userProfile.family_name) {
    return `${userProfile.given_name} ${userProfile.family_name}`;
  }

  return userProfile?.username || 'Unknown User';
};