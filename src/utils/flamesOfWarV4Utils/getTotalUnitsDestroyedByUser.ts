import { Match } from '~/types/Match';

/**
 * Returns the total number of units destroyed by a given user within a set of match results.
 *
 * @param matchResults - The array of match results to include in the calculation
 * @param userId - The user UUID
 * @returns The total number of units destroyed
 */
export const getTotalUnitsDestroyedByUser = (matchResults: Match[], userId: string): number => (
  matchResults.reduce((acc, result) => {
    const playerIndex = result.players.findIndex((player) => player.user_id === userId);
    if (playerIndex === 0) {
      acc += result.outcome.player_1_units_lost;
    }
    if (playerIndex === 1) {
      acc += result.outcome.player_0_units_lost;
    }
    return acc;
  }, 0)
);
