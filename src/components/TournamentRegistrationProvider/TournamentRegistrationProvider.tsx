import { ReactNode } from 'react';

import { TournamentRegistration } from '~/api';
import { Provider } from './TournamentRegistrationProvider.context';

export interface TournamentRegistrationProviderProps {
  children: ReactNode;
  tournamentRegistration: TournamentRegistration;
}

export const TournamentRegistrationProvider = ({
  children,
  tournamentRegistration,
}: TournamentRegistrationProviderProps) => (
  <Provider value={tournamentRegistration}>
    {children}
  </Provider>
);
