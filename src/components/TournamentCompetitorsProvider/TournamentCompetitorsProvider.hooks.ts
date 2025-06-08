import { useContext } from 'react';

import { TournamentCompetitor } from '~/api';
import { TournamentCompetitorsContext } from './TournamentCompetitorsProvider.context';

export interface UseTournamentCompetitorsArgs {
  onlyActive?: boolean;
}

export const useTournamentCompetitors = (args?: UseTournamentCompetitorsArgs): TournamentCompetitor[] => {
  const context = useContext(TournamentCompetitorsContext);
  if (!context) {
    throw Error('useTournamentCompetitors must be used within a <TournamentCompetitorsProvider />!');
  }
  if (args?.onlyActive) {
    return context.filter((c) => c.active);
  }
  return context;
};
