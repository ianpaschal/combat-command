import { Database, Tables } from '~/types/__generated__/database.types';
import { TournamentPairingDeep } from '~/types/db/TournamentPairings';
import { FowV4GameSystemConfig } from '~/types/fowV4/fowV4GameSystemConfigSchema';

export type TournamentRow = Database['public']['Tables']['tournaments']['Row'];
export type GameSystemConfigRow = Omit<Database['public']['Tables']['game_system_configs']['Row'], 'data'> & {
  data: FowV4GameSystemConfig;
};

/**
 * Raw match result row from the database.
 */
export type MatchResultRow = Database['public']['Tables']['match_results']['Row'];

/**
 * Raw player row from the database.
 */
export type PlayerRow = Database['public']['Tables']['players']['Row'];

/**
 * Raw tournament competitor row from the database.
 */
export type TournamentCompetitorRow = Database['public']['Tables']['tournament_competitors']['Row'];

/**
 * Raw user profile row from the database.
 */
export type UserProfileRow = Tables<'user_profiles'>;

/**
 * Raw user profile (secure) row from the database.
 */
export type UserProfileSecureRow = Database['public']['Views']['user_profiles_secure']['Row'] & {
  id: string; // ID ALWAYS exists!
};

// ...

export type TournamentTimerRow = Tables<'tournament_timers'>;

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

