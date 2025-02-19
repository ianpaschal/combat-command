import { createServiceHooks } from '~/services/factory/createServiceHooks';
import { GameSystemConfigRow } from '~/types/db';

/**
 * Input params for fetching a game system config list.
 */
export interface FetchGameSystemConfigListParams {}

/**
 * Input to update a game system config.
 */
export type CreateGameSystemConfigInput = Omit<GameSystemConfigRow, 'id' | 'created_at' | 'updated_at'>;

export const {
  useFetch: useFetchGameSystemConfig,
  useFetchList: useFetchGameSystemConfigList,
  useCreate: useCreateGameSystemConfig,
  useUpdate: useUpdateGameSystemConfig,
  useDelete: useDeleteGameSystemConfig,
} = createServiceHooks<GameSystemConfigRow, FetchGameSystemConfigListParams, CreateGameSystemConfigInput>('game-system-configs');
