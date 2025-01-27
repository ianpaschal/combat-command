import { MatchDeep } from '~/types/db/Matches';

type MatchScoreInput = Pick<MatchDeep, 'winner' | 'player_0_units_lost' | 'player_1_units_lost'>;

/**
 * Calculate the Victory Points (i.e. score) for a given match result.
 * 
 * @remarks
 * Calculation is based on pg. 101, Flames of War 4th Ed. rule book, ISBN: 9780994147479.
 * 
 * @param matchResult - The match result to score
 * @returns - A tuple with the scores for player 0 and 1 respectively
 */
export const calculateMatchScore = (match: MatchScoreInput): [number, number] => {

  // Player 0 Wins
  if (match.winner === 0) {
    if (match.player_0_units_lost < 2) {
      return [8, 1];
    }
    if (match.player_0_units_lost < 3) {
      return [7, 2];
    }
    return [6, 3];
  }

  // Player 1 Wins
  if (match.winner === 1) {
    if (match.player_1_units_lost < 2) {
      return [1, 8];
    }
    if (match.player_1_units_lost < 3) {
      return [2, 7];
    }
    return [3, 6];
  }

  // Draw
  return [
    Math.max(Math.min(match.player_1_units_lost, 3), 1),
    Math.max(Math.min(match.player_0_units_lost, 3), 1),
  ];
};