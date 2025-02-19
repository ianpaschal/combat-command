import { createServiceHooks } from '~/services/factory/createServiceHooks';
import { PlayerRow } from '~/types/db';

export const {
  useFetch: useFetchPlayer,
  useFetchList: useFetchPlayerList,
  useCreate: useCreatePlayer,
  useUpdate: useUpdatePlayer,
  useDelete: useDeletePlayer,
} = createServiceHooks<PlayerRow, object, object>('players');
