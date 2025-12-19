import { useContext } from 'react';

import { LeagueContext } from './LeagueProvider.context';

export const useLeague = () => {
  const context = useContext(LeagueContext);
  if (!context) {
    throw Error('useLeague must be used within a LeagueProvider!');
  }
  return context;
};
