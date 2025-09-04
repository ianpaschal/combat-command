import { UserDataVisibilityLevel } from '../../common/userDataVisibilityLevel';

/**
 * Compares two user data visibility levels to determine if an actual level satisfies the subject's required level.
 * 
 * @param requiredLevel 
 * @param actualLevel 
 * @returns True if the actual level is sufficient to satisfy the subject's required level
 */
export const compareVisibilityLevels = (
  requiredLevel?: UserDataVisibilityLevel,
  actualLevel?: UserDataVisibilityLevel,
): boolean => {
  if (!requiredLevel || !actualLevel) {
    return false;
  }
  // Levels, ordered from least close to most
  const orderedLevels: Record<UserDataVisibilityLevel, number> = {
    public: 0,
    community: 1,
    tournaments: 2,
    clubs: 3,
    friends: 4,
    hidden: 9999,
  };
  
  return orderedLevels[actualLevel] >= orderedLevels[requiredLevel];
};
