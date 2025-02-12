import { supabase } from '~/supabaseClient';
import {
  PlayerRow,
  TournamentCompetitorRow,
  UserProfileSecureRow,
} from '~/types/db';

/**
 * Response for a player row with relevant tables adjoined.
 */
export interface FetchPlayerResponse extends Omit<PlayerRow, 'details'> {
  user_profile: UserProfileSecureRow;
  tournament_competitor: TournamentCompetitorRow;
}

/**
 * Base query used by useFetchPlayer and useFetchPlayerList.
 * This MUST be manually kept in sync with the FetchPlayerResponse type!
 */
export const fetchPlayerBaseQuery = supabase.from('players').select(`
  *,
  user_profile: user_profiles_secure!profile_id (*),
  tournament_competitor: tournament_competitors!tournament_competitor_id (*)
`);