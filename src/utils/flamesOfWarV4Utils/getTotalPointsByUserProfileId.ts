import { MatchResultRowFilterableRow } from '~/services/matchResults/fetchMatchResultBaseQuery';
import { calculateMatchScore } from './calculateMatchScore';

/**
 * Returns the total number of points scored by a given user profile within a set of match results.
 *
 * @param matchResults - The array of match results to check
 * @param userProfileId - The user profile UUID
 * @returns The total number of points
 */
export const getTotalPointsByUserProfileId = (
  matchResults: MatchResultRowFilterableRow[],
  userProfileId: string,
): number => (
  matchResults.reduce((acc, result) => {
    const points = calculateMatchScore(result);
    if (result.player_0.user_profile.id === userProfileId) {
      return acc += points[0];
    }
    if (result.player_1.user_profile.id === userProfileId) {
      return acc += points[1];
    }
    return acc;
  }, 0)
);
