import { User } from '~/types/User';

export const getUserDisplayName = (userProfile: User | null): string => {
  if (userProfile === null) {
    return 'Unknown User';
  }

  if (userProfile.name_visibility === 'public' ) {
    return `${userProfile.given_name} ${userProfile.family_name}`;
  }

  return userProfile.username;
};