import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { sentenceCase } from 'change-case';

import { toast } from '~/components/ToastProvider';
import { handleError } from '~/services/handleError';
import { createGameSystemConfig } from './createGameSystemConfig';
import { deleteGameSystemConfig } from './deleteGameSystemConfig';
import { fetchGameSystemConfig } from './fetchGameSystemConfig';
import { fetchGameSystemConfigList, FetchGameSystemConfigListParams } from './fetchGameSystemConfigList';
import { updateGameSystemConfig } from './updateGameSystemConfig';

const rootQueryKey = 'game_system_configs';

export const useFetchGameSystemConfig = (
  id: string,
  enabled?: boolean,
) => useQuery({
  queryKey: [rootQueryKey, 'single', id],
  queryFn: () => fetchGameSystemConfig(id),
  enabled,
});

export const useFetchGameSystemConfigList = (
  params?: FetchGameSystemConfigListParams,
  enabled?: boolean,
) => useQuery({
  queryKey: [rootQueryKey, 'list', params],
  queryFn: () => fetchGameSystemConfigList(params),
  enabled,
});

export const useCreateGameSystemConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGameSystemConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [rootQueryKey, 'list'] });
      toast.success(`${sentenceCase(rootQueryKey)} created!`);
    },
    onError: handleError,
  });
};

export const useUpdateGameSystemConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGameSystemConfig,
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: [rootQueryKey, 'list'] });
      queryClient.invalidateQueries({ queryKey: [rootQueryKey, 'single', id] });
      toast.success(`${sentenceCase(rootQueryKey)} updated!`);
    },
    onError: handleError,
  });
};

export const useDeleteGameSystemConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGameSystemConfig,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: [rootQueryKey, 'list'] });
      queryClient.invalidateQueries({ queryKey: [rootQueryKey, 'single', id] });
      toast.success(`${sentenceCase(rootQueryKey)} deleted!`);
    },
    onError: handleError,
  });
};
