import { ReactNode } from 'react';

import { TournamentCompetitor } from '~/api';
import { Provider } from './TournamentCompetitorProvider.context';

export interface TournamentCompetitorProviderProps {
  children: ReactNode;
  tournamentCompetitor: TournamentCompetitor;
}

export const TournamentCompetitorProvider = ({
  children,
  tournamentCompetitor,
}: TournamentCompetitorProviderProps) => (
  <Provider value={tournamentCompetitor}>
    {children}
  </Provider>
);
