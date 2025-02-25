import { FetchTournamentItem } from '~/services/tournaments/fetchTournament';
import { applySupabaseFilters } from '~/services/utils/applySupabaseFilters';
import { supabase } from '~/supabaseClient';

const tableName = 'tournaments' as const;

export interface FetchTournamentListParams {
  userProfileId?: string;
  tournamentId?: string;
}

export const fetchTournamentList = async (params?: FetchTournamentListParams) => {
  const { data, error } = await applySupabaseFilters(
    supabase.from(tableName).select(`
      *,
      game_system_config: game_system_configs (*)
      
    `),
    {
      userProfileId: ['user_profile.id', 'equals'],
      tournamentId: ['tournament_competitor.tournament_id', 'equals'],
    },
    params,
  );
  if (error) {
    throw error;
  }
  return data as FetchTournamentItem[]; // TODO: Figure out how to avoid this cast. Better type generation from Supabase?
};
