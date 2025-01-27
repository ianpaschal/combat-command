import { UserProfileSecureRow } from '~/types/db';
import { NullConversion } from '~/utils/nullsToUndefined';

export const getUserDisplayName = (userProfile: NullConversion<UserProfileSecureRow> | undefined): string => {
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