import { FowV4MatchResultDetails } from './fowV4MatchResultDetails';

/**
 * Calculate the Victory Points (i.e. score) for a given match result.
 * 
 * @remarks
 * Calculation is based on pg. 101, Flames of War 4th Ed. rule book, ISBN: 9780994147479.
 * 
 * @param details - The match result details to score
 * @returns - A tuple with the scores for player 0 and 1 respectively
 */
export const calculateFowV4MatchResultScore = (details: Pick<FowV4MatchResultDetails, 'winner'|'player0UnitsLost'|'player1UnitsLost'>): [number, number] => {

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
