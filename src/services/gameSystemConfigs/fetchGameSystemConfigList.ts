import { applySupabaseFilters } from '~/services/utils/applySupabaseFilters';
import { supabase } from '~/supabaseClient';
import { FetchGameSystemConfigItem } from './fetchGameSystemConfig';

const tableName = 'game_system_configs' as const;

export interface FetchGameSystemConfigListParams {
  gameSystemId?: string;
}

export const fetchGameSystemConfigList = async (params?: FetchGameSystemConfigListParams) => {
  const { data, error } = await applySupabaseFilters(
    supabase.from(tableName).select('*'),
    {
      gameSystemId: ['game_system_id', 'equals'],
    },
    params,
  );
  if (error) {
    throw error;
  }
  return data as FetchGameSystemConfigItem[]; // TODO: Figure out how to avoid this cast. Better type generation from Supabase?
};
