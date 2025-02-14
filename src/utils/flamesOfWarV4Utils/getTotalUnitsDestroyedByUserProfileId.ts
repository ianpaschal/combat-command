import { FetchMatchResultResponse } from '~/services/matchResults/fetchMatchResultBaseQuery';

/**
 * Returns the total number of units destroyed by a given User Profile within a set of match results.
 *
 * @param matchResults - The array of match results to check
 * @param profileId - The User Profile UUID
 * @returns The total number of units destroyed
 */
export const getTotalUnitsDestroyedByUserProfileId = (
  matchResults: FetchMatchResultResponse[],
  profileId: string,
): number => (
  matchResults.reduce((acc, result) => {
    if (result.player_0.user_profile.id === profileId) {
      return acc += result.details.player_1_units_lost; // Opponent's losses
    }
    if (result.player_1.user_profile.id === profileId) {
      return acc += result.details.player_0_units_lost; // Opponent's losses
    }
    return acc;
  }, 0)
);
