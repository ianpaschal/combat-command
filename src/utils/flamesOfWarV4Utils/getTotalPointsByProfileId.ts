import { MatchResultDeep } from '~/types/db';
import { calculateMatchScore } from './calculateMatchScore';

/**
 * Returns the total number of points scored by a given profile within a set of match results.
 *
 * @param matchResults - The array of match results to check
 * @param profileId - The profile UUID
 * @returns The total number of points
 */
export const getTotalPointsByProfileId = (
  matchResults: MatchResultDeep[],
  profileId: string,
): number => (
  matchResults.reduce((acc, result) => {
    const points = calculateMatchScore(result);
    if (result.player_0.profile.id === profileId) {
      return acc += points[0];
    }
    if (result.player_1.profile.id === profileId) {
      return acc += points[1];
    }
    return acc;
  }, 0)
);
