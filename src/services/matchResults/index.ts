import { createServiceHooks } from '~/services/factory/createServiceHooks';
import { MatchResultRow } from '~/types/db';

export const {
  useFetch: useFetchMatchResult,
  useFetchList: useFetchMatchResultList,
  useCreate: useCreateMatchResult,
  useUpdate: useUpdateMatchResult,
  useDelete: useDeleteMatchResult,
} = createServiceHooks<MatchResultRow, object, object>('match-results');
