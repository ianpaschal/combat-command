import { ReactNode } from 'react';

import { Tournament } from '~/api';

import { TournamentContext } from './TournamentProvider.context';

export interface TournamentProviderProps {
  children: ReactNode;
  tournament: Tournament;
}

export const TournamentProvider = ({
  children,
  tournament,
}: TournamentProviderProps) => (
  <TournamentContext.Provider value={tournament}>
    {children}
  </TournamentContext.Provider>
);
