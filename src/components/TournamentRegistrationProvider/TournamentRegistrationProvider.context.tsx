import { createContext } from 'react';

import { TournamentRegistration } from '~/api';

export const tournamentRegistrationContext = createContext<TournamentRegistration | null>(null);

export const { Provider } = tournamentRegistrationContext;
