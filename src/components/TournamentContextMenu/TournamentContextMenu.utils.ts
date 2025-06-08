import { TournamentOpenRound } from '~/services/tournaments';

export const getRemainingRequiredMatchResults = (
  openRound?: TournamentOpenRound,
): number | null => {
  if (!openRound) {
    return null;
  }
  return openRound.matchResultsProgress.required - openRound.matchResultsProgress.submitted;
};
