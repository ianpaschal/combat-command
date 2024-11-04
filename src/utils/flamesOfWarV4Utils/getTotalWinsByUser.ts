import { Match } from '~/types/Match';

/**
 * Returns the total number of wins by a given user within a set of match results.
 *
 * @param matchResults - The array of match results to include in the calculation
 * @param userId - The user UUID
 * @returns The total number of wins
 */
export const getTotalWinsByUser = (matchResults: Match[], userId: string): number => (
  matchResults.reduce((acc, result) => {
    const playerIndex = result.players.findIndex((player) => player.user_id === userId);
    if (result.outcome.winner === playerIndex) {
      acc += 1;
    }
    return acc;
  }, 0)
);
