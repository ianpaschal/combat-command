import { Database, Tables } from './__generated__/database.types.ts';

export type Views<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row'];

type Override<Type, NewType extends { [key in keyof Type]?: NewType[key] }> = Omit<Type, keyof NewType> & NewType;

export type GenericRow = {
  id: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type UserProfileSecureRow = Override<Views<'user_profiles_secure'>, GenericRow>;

export type TournamentCompetitorRow = Override<Tables<'tournament_competitors'>, GenericRow>;

export type { MatchResultDeep } from '../match-results/index.ts';
