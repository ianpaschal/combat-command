import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { sentenceCase } from 'change-case';

import { toast } from '~/components/ToastProvider';
import { handleError } from '~/services/handleError';
import { createTournamentPairing } from './createTournamentPairing';
import { deleteTournamentPairing } from './deleteTournamentPairing';
import { fetchTournamentPairing } from './fetchTournamentPairing';
import { fetchTournamentPairingList, FetchTournamentPairingListParams } from './fetchTournamentPairingList';
import { updateTournamentPairing } from './updateTournamentPairing';

const rootQueryKey = 'tournament_pairings';

export const useFetchTournamentPairing = (
  id: string,
  enabled?: boolean,
) => useQuery({
  queryKey: [rootQueryKey, 'single', id],
  queryFn: () => fetchTournamentPairing(id),
  enabled,
});

export const useFetchTournamentPairingList = (
  params?: FetchTournamentPairingListParams,
  enabled?: boolean,
) => useQuery({
  queryKey: [rootQueryKey, 'list', params],
  queryFn: () => fetchTournamentPairingList(params),
  enabled,
});

export const useCreateTournamentPairing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTournamentPairing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [rootQueryKey, 'list'] });
      toast.success(`${sentenceCase(rootQueryKey)} created!`);
    },
    onError: handleError,
  });
};

export const useUpdateTournamentPairing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTournamentPairing,
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: [rootQueryKey, 'list'] });
      queryClient.invalidateQueries({ queryKey: [rootQueryKey, 'single', id] });
      toast.success(`${sentenceCase(rootQueryKey)} updated!`);
    },
    onError: handleError,
  });
};

export const useDeleteTournamentPairing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTournamentPairing,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: [rootQueryKey, 'list'] });
      queryClient.invalidateQueries({ queryKey: [rootQueryKey, 'single', id] });
      toast.success(`${sentenceCase(rootQueryKey)} deleted!`);
    },
    onError: handleError,
  });
};
