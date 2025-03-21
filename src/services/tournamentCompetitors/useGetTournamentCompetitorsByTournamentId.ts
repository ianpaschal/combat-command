import { useRef } from 'react';
import { useQuery } from 'convex/react';

import { api, TournamentId } from '~/api';

export const useGetTournamentCompetitorsByTournamentId = (tournamentId?: TournamentId) => {
  const data = useQuery(api.tournamentCompetitors.getTournamentCompetitorListByTournamentId, tournamentId ? { tournamentId } : 'skip');
  const stored = useRef(data);
  if (data !== undefined) {
    stored.current = data;
  }
  if (!tournamentId) {
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
