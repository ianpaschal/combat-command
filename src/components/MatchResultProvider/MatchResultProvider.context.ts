import { createContext } from 'react';

import { MatchResult } from '~/api';

export const MatchResultContext = createContext<MatchResult | null>(null);
