import { ReactNode } from 'react';

import { MatchResult } from '~/api';
import { MatchResultContext } from './MatchResultProvider.context';

export interface MatchResultProviderProps {
  children: ReactNode;
  matchResult: MatchResult;
}

export const MatchResultProvider = ({
  children,
  matchResult,
}: MatchResultProviderProps) => (
  <MatchResultContext.Provider value={matchResult}>
    {children}
  </MatchResultContext.Provider>
);
