import { SupabaseClient } from 'jsr:@supabase/supabase-js@2';

import { Database, Tables } from '../_shared/__generated__/database.types.ts';
import { createRequestHandler } from '../_shared/createRequestHandler.ts';

const tableName = 'match_results';
const url = tableName.replace('_', '-');

export type MatchResultDeep = Awaited<ReturnType<typeof fetchSingle>>;

export type FetchMatchResultListParams = {
  tournament_id?: string;
  game_system_id?: string;
  user_profile_id?: string;
};

const matchResultSelector = `
  id,
  created_at,
  updated_at,
  details,
  player_0: players!player_0_id (
    id,
    created_at,
    updated_at,
    user_profile: user_profiles_secure (*),
    tournament_competitor: tournament_competitors (*)
  ),
  player_1: players!player_1_id (
    id,
    created_at,
    updated_at,
    user_profile: user_profiles_secure (*),
    tournament_competitor: tournament_competitors (*)
  ),
  pairing: tournament_pairings!inner (*),
  game_system_config: game_system_configs!inner (*)
`;

const fetchSingle = async (client: SupabaseClient<Database>, id: string) => (
  await client.from(tableName).select(matchResultSelector).eq('id', id).single()
);

const fetchList = async (client: SupabaseClient<Database>, params: FetchMatchResultListParams) => {
  const query = client.from(tableName).select(matchResultSelector);

  // Apply pre-filters:
  if (params.tournament_id !== undefined) {
    query.filter('tournament_pairings.tournament_id', 'eq', params.tournament_id);
  }
  if (params.game_system_id) {
    query.filter('game_system_configs.game_system_id', 'eq', params.game_system_id);
  }

  const result = await query;

  // Apply post-filters because Supabase can't handle OR filters properly
  if (result.data) {
    if (params.user_profile_id !== undefined) {
      result.data = result.data.filter((item) => (
        item.player_0?.user_profile.id === params.user_profile_id
      ) || (
        item.player_1?.user_profile.id === params.user_profile_id
      ));
    }
  }

  return result;
};

const createBulk = async (client: SupabaseClient<Database>, input: Tables<'match_results'>[]) => (
  await client.from(tableName).insert(input).select(matchResultSelector)
);

Deno.serve(createRequestHandler(url, {
  fetchSingle,
  fetchList,
  createSingle: async (client, input) => {
    const result = await client.from(tableName).insert(input).select(matchResultSelector).single();
    return result;
  },
  createBulk,
  update: async (client, { id, ...input }) => {
    const result = await client.from(tableName).update(input).eq('id', id).select(matchResultSelector).single();
    return result;
  },
  delete: async (client, id) => {
    const result = await client.from(tableName).delete().eq('id', id);
    return result;
  },
}));
