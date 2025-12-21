import { createContext } from 'react';

import { Tournament } from '~/api';

export const tournamentContext = createContext<Tournament | null>(null);

export const { Provider } = tournamentContext;
