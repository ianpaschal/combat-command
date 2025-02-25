import { supabase } from '~/supabaseClient';
import {
  Override,
  UserProfileSecureRow,
  Views,
} from '~/types/db';

const tableName = 'tournament_competitors' as const;
const filterableViewName = `${tableName}_filterable` as const;

export type FetchTournamentCompetitorItem = Override<Views<typeof filterableViewName>, {
  id: string;
  created_at: string;
  players: {
    id: string;
    created_at: string;
    updated_at: string | null;
    placeholder_name: string | null;
    user_profile: UserProfileSecureRow;
  }[];
  user_profile_ids: string[];
}>;

export const fetchTournamentCompetitor = async (id: string) => {
  const { data, error } = await supabase.from(filterableViewName).select('*').eq('id', id).single();
  if (error) {
    throw error;
  }
  return data as FetchTournamentCompetitorItem; // TODO: Figure out how to avoid this cast. Better type generation from Supabase?
};
