import { FetchPlayerItem } from '~/services/players/fetchPlayer';
import { applySupabaseFilters } from '~/services/utils/applySupabaseFilters';
import { supabase } from '~/supabaseClient';

const tableName = 'players' as const;
const filterableViewName = `${tableName}_filterable` as const;

export interface FetchPlayerListParams {
  userProfileId?: string;
  tournamentId?: string;
}

export const fetchPlayerList = async (params?: FetchPlayerListParams) => {
  const { data, error } = await applySupabaseFilters(
    supabase.from(filterableViewName).select('*'),
    {
      userProfileId: ['user_profile.id', 'equals'],
      tournamentId: ['tournament_competitor.tournament_id', 'equals'],
    },
    params,
  );
  if (error) {
    throw error;
  }
  return data as FetchPlayerItem[]; // TODO: Figure out how to avoid this cast. Better type generation from Supabase?
};
