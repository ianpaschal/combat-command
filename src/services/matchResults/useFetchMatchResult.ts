import { useRef } from 'react';
import { useQuery } from 'convex/react';

import { api, MatchResultId } from '~/api';

export const useFetchMatchResult = (id?: MatchResultId) => {
  const data = useQuery(api.matchResults.fetchMatchResult.fetchMatchResult, id ? { id } : 'skip');
  const stored = useRef(data);
  if (data !== undefined) {
    stored.current = data;
  }
  return {
    data: stored.current,
    loading: stored.current === undefined,
  };
};
