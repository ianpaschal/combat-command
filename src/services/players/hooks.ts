import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { sentenceCase } from 'change-case';

import { toast } from '~/components/ToastProvider';
import { handleError } from '~/services/handleError';
import { createPlayer } from './createPlayer';
import { deletePlayer } from './deletePlayer';
import { fetchPlayer } from './fetchPlayer';
import { fetchPlayerList, FetchPlayerListParams } from './fetchPlayerList';
import { updatePlayer } from './updatePlayer';

const rootQueryKey = 'players';

export const useFetchPlayer = (
  id: string,
  enabled?: boolean,
) => useQuery({
  queryKey: [rootQueryKey, 'single', id],
  queryFn: () => fetchPlayer(id),
  enabled,
});

export const useFetchPlayerList = (
  params?: FetchPlayerListParams,
  enabled?: boolean,
) => useQuery({
  queryKey: [rootQueryKey, 'list', params],
  queryFn: () => fetchPlayerList(params),
  enabled,
});

export const useCreatePlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [rootQueryKey, 'list'] });
      toast.success(`${sentenceCase(rootQueryKey)} created!`);
    },
    onError: handleError,
  });
};

export const useUpdatePlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePlayer,
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: [rootQueryKey, 'list'] });
      queryClient.invalidateQueries({ queryKey: [rootQueryKey, 'single', id] });
      toast.success(`${sentenceCase(rootQueryKey)} updated!`);
    },
    onError: handleError,
  });
};

export const useDeletePlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePlayer,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: [rootQueryKey, 'list'] });
      queryClient.invalidateQueries({ queryKey: [rootQueryKey, 'single', id] });
      toast.success(`${sentenceCase(rootQueryKey)} deleted!`);
    },
    onError: handleError,
  });
};
