import { FetchMatchResultListResponseItem } from '~/api';

export const formatOutcome = (details: FetchMatchResultListResponseItem['details'], playerNames: [string, string]): string => {
  if (details.winner !== null && details.outcomeType === 'attack_repelled') {
    return `${playerNames[details.winner]} repelled the attack`;
  }
  if (details.winner !== null && details.outcomeType === 'objective_taken') {
    return `${playerNames[details.winner]} took the objective`;
  }
  if (details.winner !== null && details.outcomeType === 'force_broken') {
    if (details.winner === 0) {
      return `${playerNames[0]} broke ${playerNames[1]}\u{2019}s formation(s)`;
    }
    if (details.winner === 1) {
      return `${playerNames[1]} broke ${playerNames[0]}\u{2019}s formation(s)`;
    }
  }
  return 'Draw / Time Out';
};
