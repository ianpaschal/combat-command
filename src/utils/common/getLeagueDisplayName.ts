import { League } from '~/api';

export const getLeagueDisplayName = (league: Pick<League, 'editionYear'|'title'>): string => {
  if (league.editionYear) {
    return `${league.title} ${league.editionYear}`;
  }
  return league.title;
};
