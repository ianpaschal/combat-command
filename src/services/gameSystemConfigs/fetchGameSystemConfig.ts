import { useQuery } from '@tanstack/react-query';

import { getFetcher, getListFetcher } from '~/services/factory/getFetchHandler';
import { supabase } from '~/supabaseClient';
import { GameSystemConfigRow } from '~/types/db';

/**
 * Response for a game system config row with relevant tables adjoined.
 */
export interface FetchGameSystemConfigResponse extends GameSystemConfigRow {}

/**
 * Base query used to fetch a single game system config as well as a list of game system configs.
 * This MUST be manually kept in sync with the FetchGameSystemConfigResponse type!
 */
const baseQuery = supabase.from('game system configs').select('*');

/**
 * Fetches a single game system config from the database.
 */
export const fetchGameSystemConfig = getFetcher<FetchGameSystemConfigResponse>(baseQuery);

/**
 * Query hook to fetch a single game system config.
 * 
 * @param id - The ID of the game system config.
 * @param enabled
 */
export const useFetchGameSystemConfig = (
  id: string,
  enabled?: boolean,
) => useQuery({
  queryKey: ['game_system_configs', 'single', id],
  queryFn: () => fetchGameSystemConfig(id),
  enabled,
});

/**
 * Input params for fetching a game system config list.
 */
export interface FetchGameSystemConfigListParams {}

/**
 * Fetches a list of game system configs from the database.
 */
export const fetchGameSystemConfigList = getListFetcher<FetchGameSystemConfigListParams, FetchGameSystemConfigResponse>(baseQuery, {});

/**
 * Query hook to fetch list of game system configs.
 * 
 * @param params 
 * @param enabled
 */
export const useFetchGameSystemConfigList = (
  params: FetchGameSystemConfigListParams,
  enabled?: boolean,
) => useQuery({
  queryKey: ['game_system_configs', 'list', params],
  queryFn: () => fetchGameSystemConfigList(params),
  enabled,
});
