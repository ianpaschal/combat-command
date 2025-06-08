import { MatchResult } from '~/api';

/**
 * Calculate the Victory Points (i.e. score) for a given match result.
 * 
 * @remarks
 * Calculation is based on pg. 101, Flames of War 4th Ed. rule book, ISBN: 9780994147479.
 * 
 * @param details - The details object of the match result to score.
 * @param {-1 | 0 | 1} details.winner - The match result winner index.
 * @param {number} details.player0UnitsLost - Player 0's units lost.
 * @param {number} details.player1UnitsLost - Player 1's units lost.
 * @returns - A tuple with the scores for player 0 and 1 respectively.
 */
export const calculateMatchScore = (
  details: Pick<MatchResult['details'], 'winner' | 'player0UnitsLost' | 'player1UnitsLost'>,
): [number, number] => {

  // TODO: Add some guards in case matchResult is not FowV4

  // Player 0 Wins
  if (details.winner === 0) {
    if (details.player0UnitsLost < 2) {
      return [8, 1];
    }
    if (details.player0UnitsLost < 3) {
      return [7, 2];
    }
    return [6, 3];
  }

  // Player 1 Wins
  if (details.winner === 1) {
    if (details.player1UnitsLost < 2) {
      return [1, 8];
    }
    if (details.player1UnitsLost < 3) {
      return [2, 7];
    }
    return [3, 6];
  }

  // Draw
  return [
    Math.max(Math.min(details.player1UnitsLost, 3), 1),
    Math.max(Math.min(details.player0UnitsLost, 3), 1),
  ];
};
