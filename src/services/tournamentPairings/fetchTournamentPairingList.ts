import { applySupabaseFilters } from '~/services/utils/applySupabaseFilters';
import { supabase } from '~/supabaseClient';
import { fetchSelect, FetchTournamentPairingItem } from './fetchTournamentPairing';

const tableName = 'tournament_pairings' as const;
const filterableViewName = `${tableName}_filterable` as const;

export interface FetchTournamentPairingListParams {
  userProfileId?: string;
  tournamentId?: string;
  tournamentCompetitorId?: string;
}

export const fetchTournamentPairingList = async (params?: FetchTournamentPairingListParams) => {
  const { data, error } = await applySupabaseFilters(
    supabase.from(filterableViewName).select(fetchSelect),
    {
      userProfileId: ['user_profile_ids', 'contains'],
      tournamentId: ['tournament_id', 'equals'],
      tournamentCompetitorId: [['tournament_competitor_0.id', 'tournament_competitor_1.id'], 'equals'],
    },
    params,
  );
  if (error) {
    throw error;
  }
  return data as FetchTournamentPairingItem[]; // TODO: Figure out how to avoid this cast. Better type generation from Supabase?
};
