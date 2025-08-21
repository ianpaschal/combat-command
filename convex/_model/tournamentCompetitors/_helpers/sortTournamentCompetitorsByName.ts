import { DeepTournamentCompetitor } from './deepenTournamentCompetitor';

export const sortTournamentCompetitorsByName = (
  a: DeepTournamentCompetitor,
  b: DeepTournamentCompetitor,
): number => {
  const getSortValue = (competitor: DeepTournamentCompetitor): string => {
    if (competitor.teamName) {
      return competitor.teamName;
    }
    if (competitor.registrations[0]?.user) {
      return competitor.registrations[0].user.displayName;
    }
    return '';
  };
  return getSortValue(a).localeCompare(getSortValue(b));
};
