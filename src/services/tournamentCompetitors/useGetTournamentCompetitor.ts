import { useRef } from 'react';
import { useQuery } from 'convex/react';

import { api, TournamentCompetitorId } from '~/api';

export const useGetTournamentCompetitor = (id?: TournamentCompetitorId) => {
  const data = useQuery(api.tournamentCompetitors.getTournamentCompetitor, id ? { id } : 'skip');
  const stored = useRef(data);
  if (data !== undefined) {
    stored.current = data;
  }
  if (!id) {
    return {
      data: undefined,
      loading: false,
    };
  }
  return {
    data: stored.current,
    loading: stored.current === undefined,
  };
};
