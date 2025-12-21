import { createContext } from 'react';

import { TournamentCompetitor } from '~/api';

export const tournamentCompetitorContext = createContext<TournamentCompetitor | null>(null);

export const { Provider } = tournamentCompetitorContext;
