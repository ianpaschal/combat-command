import { Tournament } from '~/api';

export const getTournamentDisplayName = (tournament: Pick<Tournament, 'editionYear'|'title'>): string => {
  if (tournament.editionYear) {
    return `${tournament.title} ${tournament.editionYear}`;
  }
  return tournament.title;
};
