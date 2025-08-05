import { Doc } from '../../../_generated/dataModel';

/**
 * Joins a users given and family names together with a space.
 * 
 * @param user - The subject user
 * @returns A string of the user's real name
 */
export const formatUserRealName = (
  user: Doc<'users'>,
): string => `${user.givenName} ${user.familyName}`;
