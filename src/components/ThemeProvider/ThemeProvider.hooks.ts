import { useContext } from 'react';

import { ThemeContext } from './ThemeProvider.context';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw Error('useTournament must be used within a <TournamentCard /> or <TournamentDetailsPage />!');
  }
  return context;
};
