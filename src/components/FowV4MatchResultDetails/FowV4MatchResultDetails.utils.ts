import { FowV4MatchResultDetails } from '~/api';

export const formatOutcome = (
  details: FowV4MatchResultDetails,
  playerNames: [string, string],
): string => {
  if (details.winner === undefined) {
    return 'Hidden';
  }
  if (details.winner !== -1 && details.outcomeType === 'attack_repelled') {
    return `${playerNames[details.winner]} repelled the attack.`;
  }
  if (details.winner !== -1 && details.outcomeType === 'objective_taken') {
    return `${playerNames[details.winner]} took the objective.`;
  }
  if (details.winner !== -1 && details.outcomeType === 'force_broken') {
    if (details.winner === 0) {
      return `${playerNames[0]} broke ${playerNames[1]}\u{2019}s formation.`;
    }
    if (details.winner === 1) {
      return `${playerNames[1]} broke ${playerNames[0]}\u{2019}s formation.`;
    }
  }
  return 'Draw / Time Out';
};
