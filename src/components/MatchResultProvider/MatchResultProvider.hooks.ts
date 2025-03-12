import { useContext } from 'react';

import { MatchResultContext } from './MatchResultProvider.context';

export const useMatchResult = () => {
  const context = useContext(MatchResultContext);
  if (!context) {
    throw Error('useMatchResult must be used within a <MatchResultCard /> or <MatchResultDetailsPage />!');
  }
  return context;
};
