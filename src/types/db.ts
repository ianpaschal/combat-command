import { Database, Tables } from '~/types/__generated__/database.types';
import { TournamentPairingDeep } from '~/types/db/TournamentPairings';
import { FowV4GameSystemConfig } from '~/types/fowV4/fowV4GameSystemConfigSchema';
import { NullConversion } from '~/utils/nullsToUndefined';

export type TournamentRow = Database['public']['Tables']['tournaments']['Row'];
export type GameSystemConfigRow = Omit<Database['public']['Tables']['game_system_configs']['Row'], 'data'> & {
  data: FowV4GameSystemConfig;
};

// ...

export type PlayerRow = Database['public']['Tables']['players']['Row'];
export type TournamentCompetitorRow = Database['public']['Tables']['tournament_competitors']['Row'];

export type UserProfileSecureRow = Database['public']['Views']['user_profiles_secure']['Row'] & {
  id: string; // ID ALWAYS exists!
};
export type TournamentTimerRow = Tables<'tournament_timers'>;

export type UserProfileRow = Tables<'user_profiles'>;

export type UserProfileSecure = NullConversion<UserProfileSecureRow>;

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

