import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { sentenceCase } from 'change-case';

import { toast } from '~/components/ToastProvider';
import { handleError } from '~/services/handleError';
import { createTournament } from './createTournament';
import { deleteTournament } from './deleteTournament';
import { fetchTournament } from './fetchTournament';
import { fetchTournamentList, FetchTournamentListParams } from './fetchTournamentList';
import { updateTournament } from './updateTournament';

const rootQueryKey = 'tournaments';

export const useFetchTournament = (
  id: string,
  enabled?: boolean,
) => useQuery({
  queryKey: [rootQueryKey, 'single', id],
  queryFn: () => fetchTournament(id),
  enabled,
});

export const useFetchTournamentList = (
  params?: FetchTournamentListParams,
  enabled?: boolean,
) => useQuery({
  queryKey: [rootQueryKey, 'list', params],
  queryFn: () => fetchTournamentList(params),
  enabled,
});

export const useCreateTournament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTournament,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [rootQueryKey, 'list'] });
      toast.success(`${sentenceCase(rootQueryKey)} created!`);
    },
    onError: handleError,
  });
};

export const useUpdateTournament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTournament,
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: [rootQueryKey, 'list'] });
      queryClient.invalidateQueries({ queryKey: [rootQueryKey, 'single', id] });
      toast.success(`${sentenceCase(rootQueryKey)} updated!`);
    },
    onError: handleError,
  });
};

export const useDeleteTournament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTournament,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: [rootQueryKey, 'list'] });
      queryClient.invalidateQueries({ queryKey: [rootQueryKey, 'single', id] });
      toast.success(`${sentenceCase(rootQueryKey)} deleted!`);
    },
    onError: handleError,
  });
};
