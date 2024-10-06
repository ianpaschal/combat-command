import { Record } from './DbRecord';
import { UUID } from './UUID';

export interface MatchResult<T> extends Record {
  id: string;
  created_at: string;
  modified_at: string;

  detailed_outcome: T;

  // Foreign keys
  game_system_id: UUID;
  player_0_id: UUID;
  player_0_list_id: UUID;
  player_1_id: UUID;
  player_1_list_id: UUID;
  tournament_id?: UUID;
  tournament_pairing_id?: UUID;
}

/**
 * Pairing ID or tournament ID? Chances are if you want to view your match results, you want to know
 * what tournament they occurred in. But if you're viewing a tournament you want to query match
 * results for a given pairing ID.
 */