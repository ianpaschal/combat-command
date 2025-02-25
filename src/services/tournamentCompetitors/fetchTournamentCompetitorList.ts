import { applySupabaseFilters } from '~/services/utils/applySupabaseFilters';
import { supabase } from '~/supabaseClient';
import { FetchTournamentCompetitorItem } from './fetchTournamentCompetitor';

const tableName = 'tournament_competitors' as const;
const filterableViewName = `${tableName}_filterable` as const;

export interface FetchTournamentCompetitorListParams {
  tournamentId?: string;
}

export const fetchTournamentCompetitorList = async (params?: FetchTournamentCompetitorListParams) => {
  const { data, error } = await applySupabaseFilters(
    supabase.from(filterableViewName).select('*'),
    {
      tournamentId: ['tournament_id', 'equals'],
    },
    params,
  );
  if (error) {
    throw error;
  }
  return data as FetchTournamentCompetitorItem[]; // TODO: Figure out how to avoid this cast. Better type generation from Supabase?
};
