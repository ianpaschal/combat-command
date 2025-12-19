import { ReactNode } from 'react';

import { League } from '~/api';
import { LeagueContext } from './LeagueProvider.context';

export interface LeagueProviderProps {
  children: ReactNode;
  league: League;
}

export const LeagueProvider = ({
  children,
  league,
}: LeagueProviderProps) => (
  <LeagueContext.Provider value={league}>
    {children}
  </LeagueContext.Provider>
);
