import { MatchResultRowFilterableRow } from '~/services/matchResults/fetchMatchResultBaseQuery';

/**
 * Calculate the Victory Points (i.e. score) for a given match result.
 * 
 * @remarks
 * Calculation is based on pg. 101, Flames of War 4th Ed. rule book, ISBN: 9780994147479.
 * 
 * @param matchResult - The match result to score
 * @returns - A tuple with the scores for player 0 and 1 respectively
 */
export const calculateMatchScore = (matchResult: MatchResultRowFilterableRow): [number, number] => {

  // Player 0 Wins
  if (matchResult.details.winner === 0) {
    if (matchResult.details.player_0_units_lost < 2) {
      return [8, 1];
    }
    if (matchResult.details.player_0_units_lost < 3) {
      return [7, 2];
    }
    return [6, 3];
  }

  // Player 1 Wins
  if (matchResult.details.winner === 1) {
    if (matchResult.details.player_1_units_lost < 2) {
      return [1, 8];
    }
    if (matchResult.details.player_1_units_lost < 3) {
      return [2, 7];
    }
    return [3, 6];
  }

  // Draw
  return [
    Math.max(Math.min(matchResult.details.player_1_units_lost, 3), 1),
    Math.max(Math.min(matchResult.details.player_0_units_lost, 3), 1),
  ];
};
