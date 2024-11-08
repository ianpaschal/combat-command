import { MatchDeep } from '~/types/db/Matches';

/**
 * Returns the total number of units lost by a given profile within a set of match results.
 *
 * @param matchResults - The array of match results to check
 * @param profileId - The profile UUID
 * @returns The total number of units lost
 */
export const getTotalUnitsLostByProfileId = (
  matchResults: MatchDeep[],
  profileId: string,
): number => (
  matchResults.reduce((acc, result) => {
    if (result.player_0.profile.id === profileId) {
      return acc += result.outcome.player_0_units_lost; 
    }
    if (result.player_1.profile.id === profileId) {
      return acc += result.outcome.player_1_units_lost;
    }
    return acc;
  }, 0)
);
