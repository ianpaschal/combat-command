import { Database, Tables } from '~/types/__generated__/database.types';
import { FowV4GameSystemConfig } from '~/types/fowV4/fowV4GameSystemConfigSchema';
import { FowV4MatchOutcomeFormData } from '~/types/fowV4/fowV4MatchOutcomeSchema';
import { NullConversion } from '~/utils/nullsToUndefined';

export type TournamentRow = Database['public']['Tables']['tournaments']['Row'];
export type GameSystemConfigRow = Omit<Database['public']['Tables']['game_system_configs']['Row'], 'data'> & {
  data: FowV4GameSystemConfig;
};

// Tournament Pairings
/**
 * Raw Tournament Pairing row from the database
 */
export type TournamentPairingRow = Database['public']['Tables']['tournament_pairings']['Row'];

/**
 * Tournament Pairing row from the database, with Deep Tournament Competitors joined
 */
export type TournamentPairingDeep = TournamentPairingRow & {
  competitor_0: TournamentCompetitorDeep;
  competitor_1: TournamentCompetitorDeep;
};

/**
 * Input to create a new Tournament Pairing
 */
export type TournamentPairingInput = Omit<TournamentPairingRow, 'id' | 'created_at' | 'updated_at'>;

// ...

export type PlayerRow = Database['public']['Tables']['players']['Row'];
export type TournamentCompetitorRow = Database['public']['Tables']['tournament_competitors']['Row'];
export type MatchResultRow = Database['public']['Tables']['match_results']['Row'];
export type UserProfileSecureRow = Database['public']['Views']['user_profiles_secure']['Row'] & {
  id: string; // ID ALWAYS exists!
};
export type TournamentTimerRow = Tables<'tournament_timers'>;

export type UserProfileRow = Tables<'user_profiles'>;

export type UserProfileSecure = NullConversion<UserProfileSecureRow>;

export type MatchResultInsert = Omit<MatchResultRow, 'id' | 'created_at' | 'updated_at'> & {
  tournament_id: string;
};

// Deep nested results
export interface PlayerDeep extends PlayerRow {
  profile: UserProfileSecureRow;
}

export interface TournamentCompetitorDeep extends TournamentCompetitorRow {
  players: PlayerDeep[];
}

export interface TournamentDeep extends TournamentRow {
  game_system_config: GameSystemConfigRow;
  pairings: TournamentPairingDeep[];
  competitors: TournamentCompetitorDeep[];
  timers: TournamentTimerRow[];
}

export interface MatchResultDeep extends MatchResultRow {
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
}

export type MatchResultDraft = Omit<MatchResultDeep, 'id' | 'created_at' | 'updated_at'>;