import { createContext } from 'react';

import { League } from '~/api';

export const LeagueContext = createContext<League | null>(null);
