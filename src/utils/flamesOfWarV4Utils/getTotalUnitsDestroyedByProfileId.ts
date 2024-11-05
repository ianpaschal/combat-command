import { MatchResultDeep } from '~/types/db';

/**
 * Returns the total number of units destroyed by a given profile within a set of match results.
 *
 * @param matchResults - The array of match results to check
 * @param profileId - The profile UUID
 * @returns The total number of units destroyed
 */
export const getTotalUnitsDestroyedByProfileId = (
  matchResults: MatchResultDeep[],
  profileId: string,
): number => (
  matchResults.reduce((acc, result) => {
    if (result.player_0.profile.id === profileId) {
      return acc += result.outcome.player_1_units_lost; // Opponent's losses
    }
    if (result.player_1.profile.id === profileId) {
      return acc += result.outcome.player_0_units_lost; // Opponent's losses
    }
    return acc;
  }, 0)
);
