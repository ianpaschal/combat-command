import { UserDataVisibilityLevel } from '../../common/userDataVisibilityLevel';

/**
 * Compares two user data visibility levels to determine if the querying user's relationship level satisfies the subject's required level.
 * 
 * @param requiredLevel 
 * @param relationshipLevel 
 * @returns True if the relationship level is sufficient to satisfy the subject's required level
 */
export const compareVisibilityLevels = (
  requiredLevel: UserDataVisibilityLevel,
  relationshipLevel: UserDataVisibilityLevel,
): boolean => {

  // Levels, ordered from least close to most
  const orderedLevels: Record<UserDataVisibilityLevel, number> = {
    public: 0,
    community: 1,
    tournaments: 2,
    clubs: 3,
    friends: 4,
    hidden: 9999,
  };
  
  return orderedLevels[relationshipLevel] >= orderedLevels[requiredLevel];
};
