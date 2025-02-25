import { PostgrestError } from '@supabase/supabase-js';

import { Database, Tables } from '~/types/__generated__/database.types';
import { FowV4MatchResultDetails } from '~/types/db/FowV4MatchResultDetails';
import { TournamentPairingDeep } from '~/types/db/TournamentPairings';
import { FowV4GameSystemConfig } from '~/types/fowV4/fowV4GameSystemConfigSchema';

export type TableName = keyof Database['public']['Tables'];

export type ViewName = keyof Database['public']['Views'];

export type QueryFrom = TableName | ViewName;

export type SupabaseQueryResult<T> = {
  data: T | null;
  error: PostgrestError | null
};

export type Views<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row'];

export type Override<Type, NewType extends { [key in keyof Type]?: NewType[key] }> = Omit<Type, keyof NewType> & NewType;

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

// VIEWS
// -------------------------------------------------------------------------------------------------

/**
 * Match result (filterable) DB row with improved JSON columns and non-nullable fields.
 */
export type MatchResultFilterableRow = Override<Views<'match_results_filterable'>, {
  id: string;
  created_at: string;
  player_0: {
    id: string;
    user_profile: UserProfileSecureRow;
    tournament_competitor: TournamentCompetitorRow;
  };
  player_1: {
    id: string;
    user_profile: UserProfileSecureRow;
    tournament_competitor: TournamentCompetitorRow;
  };
  game_system_config: GameSystemConfigRow;
  details: FowV4MatchResultDetails;
  tournament_pairing: TournamentPairingRow | null;
}>;

/**
 * Player (filterable) DB row with improved JSON columns and non-nullable fields.
 */
export type PlayerFilterableRow = Override<Views<'players_filterable'>, {
  id: string;
  created_at: string;
  user_profile: UserProfileSecureRow;
  tournament_competitor: TournamentCompetitorRow;
}>;

/**
 * Tournament competitor (filterable) DB row with improved JSON columns and non-nullable fields.
 */
export type TournamentCompetitorFilterableRow = Override<Views<'tournament_competitors_filterable'>, {
  id: string;
  created_at: string;
  players: ({
    id: string;
    user_profile: UserProfileSecureRow;
  })[];
}>;

/**
 * Tournament pairing (filterable) DB row with improved JSON columns and non-nullable fields.
 */
export type TournamentPairingFilterableRow = Override<Views<'tournament_pairings_filterable'>, {
  id: string;
  created_at: string;
  tournament_competitor_0: Omit<TournamentCompetitorRow, 'tournament_id'> & {
    players: ({
      id: string;
      user_profile: UserProfileSecureRow;
    })[];
  };
  tournament_competitor_1: Omit<TournamentCompetitorRow, 'tournament_id'> & {
    players: ({
      id: string;
      user_profile: UserProfileSecureRow;
    })[];
  };
}>;

/**
 * User profile (secure) DB row with improved JSON columns and non-nullable fields.
 */
export type UserProfileSecureRow = Override<Views<'user_profiles_secure'>, {
  id: string;
  created_at: string;
}>;

// ...
// -------------------------------------------------------------------------------------------------

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
