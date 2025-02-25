import { supabase } from '~/supabaseClient';
import {
  Override,
  UserProfileSecureRow,
  Views,
} from '~/types/db';

const tableName = 'tournament_pairings' as const;
const filterableViewName = `${tableName}_filterable` as const;

export type FetchTournamentPairingItem = Override<Views<typeof filterableViewName>, {
  id: string;
  created_at: string;
  updated_at: string | null;
  round_index: number;
  table_index: number;
  tournament_competitor_0: {
    id: string;
    created_at: string;
    updated_at: string | null;
    team_name: string | null;
    country_code: string | null;
    players: {
      id: string;
      created_at: string;
      updated_at: string | null;
      placeholder_name: string | null;
      user_profile: UserProfileSecureRow;
    }[];
  };
  tournament_competitor_1: {
    id: string;
    created_at: string;
    updated_at: string | null;
    team_name: string | null;
    country_code: string | null;
    players: {
      id: string;
      created_at: string;
      updated_at: string | null;
      placeholder_name: string | null;
      user_profile: UserProfileSecureRow;
    }[];
  };
}>;

export const fetchSelect = `
  id,
  created_at,
  updated_at,
  round_index,
  table_index,
  tournament_competitor_0,
  tournament_competitor_1
`;

export const fetchTournamentPairing = async (id: string) => {
  const { data, error } = await supabase.from(filterableViewName).select(fetchSelect).eq('id', id).single();
  if (error) {
    throw error;
  }
  return data as FetchTournamentPairingItem; // TODO: Figure out how to avoid this cast. Better type generation from Supabase?
};
