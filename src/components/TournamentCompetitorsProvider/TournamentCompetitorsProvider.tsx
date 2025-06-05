import { ReactNode } from 'react';

import { TournamentCompetitor } from '~/api';
import { TournamentCompetitorsContext } from './TournamentCompetitorsProvider.context';

export interface TournamentCompetitorsProviderProps {
  children: ReactNode;
  tournamentCompetitors: TournamentCompetitor[];
}

export const TournamentCompetitorsProvider = ({
  children,
  tournamentCompetitors,
}: TournamentCompetitorsProviderProps) => (
  <TournamentCompetitorsContext.Provider value={tournamentCompetitors}>
    {children}
  </TournamentCompetitorsContext.Provider>
);
