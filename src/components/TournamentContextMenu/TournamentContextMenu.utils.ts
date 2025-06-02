import { TournamentOpenRound } from '~/services/tournaments';

export const getRemainingRequiredMatchResults = (
  activeRound?: TournamentOpenRound,
): number | null => {
  if (!activeRound) {
    return null;
  }
  return activeRound.matchResultsProgress.required - activeRound.matchResultsProgress.submitted;
};
