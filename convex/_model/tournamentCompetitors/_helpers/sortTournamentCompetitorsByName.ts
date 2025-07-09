import { DeepTournamentCompetitor } from './deepenTournamentCompetitor';

export const sortTournamentCompetitorsByName = (
  a: DeepTournamentCompetitor,
  b: DeepTournamentCompetitor,
): number => {
  const getSortValue = (competitor: DeepTournamentCompetitor): string => {
    if (competitor.teamName) {
      return competitor.teamName;
    }
    if (competitor.players[0]?.user.familyName) {
      return competitor.players[0].user.familyName;
    }
    if (competitor.players[0]?.user.username) {
      return competitor.players[0].user.username;
    }
    return '';
  };
  return getSortValue(a).localeCompare(getSortValue(b));
};
