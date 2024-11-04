import { Match } from '~/types/Match';
import { calculateMatchScore } from './calculateMatchScore';

/**
 * Returns the total number of points scored by a given user within a set of match results.
 *
 * @param matchResults - The array of match results to include in the calculation
 * @param userId - The user UUID
 * @returns The total number of points
 */
export const getTotalPointsByUser = (matchResults: Match[], userId: string): number => (
  matchResults.reduce((acc, result) => {
    const playerIndex = result.players.findIndex((player) => player.user_id === userId);
    const points = calculateMatchScore(result);
    return acc += points[playerIndex];
  }, 0)
);
