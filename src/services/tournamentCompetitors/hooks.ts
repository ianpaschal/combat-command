import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { sentenceCase } from 'change-case';

import { toast } from '~/components/ToastProvider';
import { handleError } from '~/services/handleError';
import { createTournamentCompetitor } from './createTournamentCompetitor';
import { deleteTournamentCompetitor } from './deleteTournamentCompetitor';
import { fetchTournamentCompetitor } from './fetchTournamentCompetitor';
import { fetchTournamentCompetitorList, FetchTournamentCompetitorListParams } from './fetchTournamentCompetitorList';
import { updateTournamentCompetitor } from './updateTournamentCompetitor';

const rootQueryKey = 'tournament_competitors';

export const useFetchTournamentCompetitor = (
  id: string,
  enabled?: boolean,
) => useQuery({
  queryKey: [rootQueryKey, 'single', id],
  queryFn: () => fetchTournamentCompetitor(id),
  enabled,
});

export const useFetchTournamentCompetitorList = (
  params?: FetchTournamentCompetitorListParams,
  enabled?: boolean,
) => useQuery({
  queryKey: [rootQueryKey, 'list', params],
  queryFn: () => fetchTournamentCompetitorList(params),
  enabled,
});

export const useCreateTournamentCompetitor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTournamentCompetitor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [rootQueryKey, 'list'] });
      toast.success(`${sentenceCase(rootQueryKey)} created!`);
    },
    onError: handleError,
  });
};

export const useUpdateTournamentCompetitor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTournamentCompetitor,
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: [rootQueryKey, 'list'] });
      queryClient.invalidateQueries({ queryKey: [rootQueryKey, 'single', id] });
      toast.success(`${sentenceCase(rootQueryKey)} updated!`);
    },
    onError: handleError,
  });
};

export const useDeleteTournamentCompetitor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTournamentCompetitor,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: [rootQueryKey, 'list'] });
      queryClient.invalidateQueries({ queryKey: [rootQueryKey, 'single', id] });
      toast.success(`${sentenceCase(rootQueryKey)} deleted!`);
    },
    onError: handleError,
  });
};
