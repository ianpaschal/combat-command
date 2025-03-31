import { useContext } from 'react';

import { TournamentContext } from './TournamentProvider.context';

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw Error('useTournament must be used within a <TournamentCard /> or <TournamentDetailsPage />!');
  }
  return context;
};
