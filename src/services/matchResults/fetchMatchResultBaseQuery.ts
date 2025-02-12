import { supabase } from '~/supabaseClient';
import {
  GameSystemConfigRow,
  MatchResult,
  TournamentCompetitorRow,
  UserProfileSecureRow,
} from '~/types/db';
import { FowV4MatchResultDetails } from '~/types/db/FowV4MatchResultDetails';
import { TournamentPairingRow } from '~/types/db/TournamentPairings';

/**
 * Response for a match result row with relevant tables adjoined
 */
export interface FetchMatchResultResponse extends Omit<MatchResult, 'details'> {
  player_0: {
    user_profile: UserProfileSecureRow;
    tournament_competitor: TournamentCompetitorRow;
  };
  player_1: {
    user_profile: UserProfileSecureRow;
    tournament_competitor: TournamentCompetitorRow;
  };
  details: FowV4MatchResultDetails;
  pairing?: TournamentPairingRow;
  game_system_config: GameSystemConfigRow;
}

/**
 * Base query used by useFetchMatchResult and useFetchMatchResultList
 * This MUST be manually kept in sync with the FetchMatchResultResponse type
 */
export const fetchMatchResultBaseQuery = supabase.from('match_results').select(`
  *,
  player_0: players!player_0_id (
    *,
    user_profile: user_profiles_secure!profile_id (*),
    tournament_competitor: tournament_competitors!tournament_competitor_id (*)
  ),
  player_1: players!player_1_id (
    *,
    user_profile: user_profiles_secure!profile_id (*),
    tournament_competitor: tournament_competitors!tournament_competitor_id (*)
  ),
  pairing: tournament_pairings!inner (*),
  game_system_config: game_system_configs (*)
`);