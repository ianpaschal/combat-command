import { UserProfile, UserProfileRecord } from '~/types/UserProfile';

export const getUserDisplayName = (userProfile: UserProfile | UserProfileRecord): string => {
  if (!userProfile) {
    return 'Unknown User';
  }

  if (userProfile.given_name && userProfile.family_name) {
    return `${userProfile.given_name} ${userProfile.family_name}`;
  }

  return userProfile.username;
};