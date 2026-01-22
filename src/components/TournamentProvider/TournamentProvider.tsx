import { ReactNode } from 'react';

import { Tournament } from '~/api';
import { Provider } from './TournamentProvider.context';

export interface TournamentProviderProps {
  children: ReactNode;
  tournament: Tournament;
}

export const TournamentProvider = ({
  children,
  tournament,
}: TournamentProviderProps) => (
  <Provider value={tournament}>
    {children}
  </Provider>
);
