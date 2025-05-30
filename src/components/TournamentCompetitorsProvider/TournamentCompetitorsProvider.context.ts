import { createContext } from 'react';

import { TournamentCompetitor } from '~/api';

export const TournamentCompetitorsContext = createContext<TournamentCompetitor[] | null>(null);
