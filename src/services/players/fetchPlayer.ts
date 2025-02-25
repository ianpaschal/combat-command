import { supabase } from '~/supabaseClient';
import {
  Override,
  TournamentCompetitorRow,
  UserProfileSecureRow,
  Views,
} from '~/types/db';

const tableName = 'players' as const;
const filterableViewName = `${tableName}_filterable` as const;

export type FetchPlayerItem = Override<Views<typeof filterableViewName>, {
  id: string;
  created_at: string;
  user_profile: UserProfileSecureRow;
  tournament_competitor: TournamentCompetitorRow | null;
}>;

export const fetchPlayer = async (id: string) => {
  const { data, error } = await supabase.from(filterableViewName).select('*').eq('id', id).single();
  if (error) {
    throw error;
  }
  return data as FetchPlayerItem; // TODO: Figure out how to avoid this cast. Better type generation from Supabase?
};
