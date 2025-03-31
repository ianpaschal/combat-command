import { createContext } from 'react';

import { Tournament } from '~/api';

export const TournamentContext = createContext<Tournament | null>(null);
