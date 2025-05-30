import { useRef } from 'react';
import { useQuery } from 'convex/react';

import { api, GetDraftTournamentPairingsArgs } from '~/api';

export const useGetDraftTournamentPairings = (args: GetDraftTournamentPairingsArgs) => {
  const data = useQuery(api.tournamentPairings.getDraftTournamentPairings, args);
  const stored = useRef(data);
  if (data !== undefined) {
    stored.current = data;
  }
  if (!args) {
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
