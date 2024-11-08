import { Database } from '~/types/__generated__/database.types';
import {
  GameSystemConfigRow,
  TournamentCompetitorRow,
  UserProfileSecureRow,
} from '~/types/db';
import { TournamentPairingRow } from '~/types/db/TournamentPairings';
import { FowV4MatchOutcomeFormData } from '~/types/fowV4/fowV4MatchOutcomeSchema';

/**
 * Raw Match row from the database
 */
export type MatchRow = Database['public']['Tables']['match_results']['Row'];

/**
 * Match row from the database, with relevant tables joined
 */
export interface MatchDeep extends MatchRow {
  player_0: {
    profile: UserProfileSecureRow;
    competitor: TournamentCompetitorRow;
  };
  player_1: {
    profile: UserProfileSecureRow;
    competitor: TournamentCompetitorRow;
  };
  outcome: FowV4MatchOutcomeFormData;
  pairing?: TournamentPairingRow;
  game_system_config: GameSystemConfigRow;
}

/**
 * Input to create a new Match
 */
export type MatchInput = Omit<MatchRow, 'id' | 'created_at' | 'updated_at'>;

export type MatchDraft = Omit<MatchDeep, 'id' | 'created_at' | 'updated_at'>;