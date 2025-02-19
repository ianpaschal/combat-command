import { supabase } from '~/supabaseClient';
import {
  GameSystemConfigRow,
  MatchResultRow,
  PlayerRow,
  TournamentCompetitorRow,
  UserProfileSecureRow,
} from '~/types/db';
import { FowV4MatchResultDetails } from '~/types/db/FowV4MatchResultDetails';
import { TournamentPairingRow } from '~/types/db/TournamentPairings';

/**
 * Response for a match result row with relevant tables adjoined.
 */
export interface MatchResultRowFilterableRow extends Omit<MatchResultRow, 'details'> {
  player_0: PlayerRow & {
    user_profile: UserProfileSecureRow;
    tournament_competitor?: TournamentCompetitorRow;
  };
  player_1: PlayerRow & {
    user_profile: UserProfileSecureRow;
    tournament_competitor?: TournamentCompetitorRow;
  };
  details: FowV4MatchResultDetails;
  pairing?: TournamentPairingRow;
  game_system_config: GameSystemConfigRow;

  // Filter columns:
  // User_profile_ids
  // tournament_id
  // game_system_id
}

/**
 * Base query used by useFetchMatchResult and useFetchMatchResultList.
 * This MUST be manually kept in sync with the MatchResultRowFilterableRow type!
 */
export const fetchMatchResultBaseQuery = supabase.from('match_results_filterable').select('*');
