import { useRef } from 'react';
import { useQuery } from 'convex/react';

import { api } from '~/api';

type Args = typeof api.tournamentPairings.getTournamentPairings._args;

export const useGetTournamentPairings= (args: Args) => {
  const data = useQuery(api.tournamentPairings.getTournamentPairings, args ?? 'skip');
  const stored = useRef(data);
  if (data !== undefined) {
    stored.current = data;
  }
  return {
    data: stored.current,
    loading: stored.current === undefined,
  };
};
