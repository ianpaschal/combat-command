import { Database, Tables } from '~/types/__generated__/database.types';
import { TournamentPairingDeep } from '~/types/db/TournamentPairings';
import { FowV4GameSystemConfig } from '~/types/fowV4/fowV4GameSystemConfigSchema';

/**
 * Raw game system config row from the database.
 */
export type GameSystemConfigRow = Omit<Tables<'game_system_configs'>, 'data'> & {
  data: FowV4GameSystemConfig; // Improve typing for JSONB field
};

/**
 * Raw match result row from the database.
 */
export type MatchResultRow = Tables<'match_results'>;

/**
 * Raw player row from the database.
 */
export type PlayerRow = Tables<'players'>;

/**
 * Raw tournament row from the database.
 */
export type TournamentRow = Tables<'tournaments'>;

/**
 * Raw tournament competitor row from the database.
 */
export type TournamentCompetitorRow = Tables<'tournament_competitors'>;

/**
 * Raw tournament pairing row from the database.
 */
export type TournamentPairingRow = Tables<'tournament_pairings'>;

/**
 * Raw tournament timer row from the database.
 */
export type TournamentTimerRow = Tables<'tournament_timers'>;

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

// Deep nested results
export interface TournamentCompetitorDeep extends TournamentCompetitorRow {
  players: (PlayerRow & {
    profile: UserProfileSecureRow;
  })[];
}

export interface TournamentDeep extends TournamentRow {
  game_system_config: GameSystemConfigRow;
  pairings: TournamentPairingDeep[];
  competitors: TournamentCompetitorDeep[];
  timers: TournamentTimerRow[];
}

