import { ReactNode } from 'react';

import { TournamentRegistration } from '~/api';
import { TournamentRegistrationContext } from './TournamentRegistrationProvider.context';
import { useActions } from './TournamentRegistrationProvider.hooks';

export interface TournamentRegistrationProviderProps {
  children: ReactNode;
  tournamentRegistration: TournamentRegistration;
}

export const TournamentRegistrationProvider = ({
  children,
  tournamentRegistration,
}: TournamentRegistrationProviderProps) => {
  const actions = useActions(tournamentRegistration);
  return (
    <TournamentRegistrationContext.Provider value={{ tournamentRegistration, actions }}>
      {children}
    </TournamentRegistrationContext.Provider>
  );
};
