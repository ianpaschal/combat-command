import { Tournament, TournamentCompetitor } from '~/api';

export const getDeleteRegistrationWarnings = (
  tournament: Tournament,
  tournamentCompetitor: TournamentCompetitor,
): string[] => {
  const warnings: string[] = [];

  const hasOtherPlayers = tournamentCompetitor.registrations.length > 1;
  const hasSparePlayers = tournamentCompetitor.registrations.length > tournament.competitorSize;

  if (tournament.useTeams) {
    if (!hasOtherPlayers) {
      warnings.push(`Team ${tournamentCompetitor.displayName} will no longer have any players and be removed.`);
    }
    if (hasOtherPlayers && !hasSparePlayers) {
      warnings.push(`Team ${tournamentCompetitor.displayName} will be left short-handed.`);
    }
  }

  return warnings;
};
