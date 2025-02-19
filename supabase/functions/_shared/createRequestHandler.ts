import {
  createClient,
  PostgrestSingleResponse,
  SupabaseClient,
} from 'jsr:@supabase/supabase-js@2';
import qs from 'node:querystring';

import { Database } from './__generated__/database.types.ts';
import { corsHeaders } from './cors.ts';
import { formatResponse } from './formatResponse.ts';

// TODO: These types could be improved...
type QueryFns<T> = {
  fetchSingle: (client: SupabaseClient<Database>, id: string) => Promise<PostgrestSingleResponse<T>>;
  fetchList: (client: SupabaseClient<Database>, params: object) => Promise<PostgrestSingleResponse<T[]>>;
  createSingle: (client: SupabaseClient<Database>, input: object) => Promise<PostgrestSingleResponse<T>>;
  createBulk: (client: SupabaseClient<Database>, input: object[]) => Promise<PostgrestSingleResponse<T[]>>;
  update: (client: SupabaseClient<Database>, input: { id: string }) => Promise<PostgrestSingleResponse<T>>;
  delete: (client: SupabaseClient<Database>, id: string) => Promise<PostgrestSingleResponse<null>>;
};

/**
 * 
 * @param resourceName - The resource name in kebab case (used to parse the request URL)
 * @param queryFns 
 * @returns 
 */
export function createRequestHandler<T extends object>(resourceName: string, queryFns: QueryFns<T>) {
  
  return async function handler(req: Request): Promise<Response> {
  // This is needed to invoke from a browser.
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    const client = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: req.headers.get('Authorization')!,
          },
        },
      },
    );

    const matchingPath = new URLPattern({
      pathname: `/${resourceName}/:id`,
    }).exec(req.url);
    const id = matchingPath?.pathname.groups.id;

    // Fetch
    if (req.method === 'GET') {
      if (id) {
        const result = await queryFns.fetchSingle(client, id);
        return formatResponse(result);
      }
      const params = qs.parse(new URL(req.url).search.slice(1));
      return formatResponse(await queryFns.fetchList(client, params));
    }

    // Create
    if (req.method === 'POST') {
      const input = await req.json();
      if (Array.isArray(input)) {
        return formatResponse(await queryFns.createBulk(client, input));
      }
      return formatResponse(await queryFns.createSingle(client, input));
    }

    // Update
    if (id && req.method === 'PUT') {
      const input = await req.json();
      return formatResponse(await queryFns.update(client, input));
    }

    // Delete
    if (id && req.method === 'DELETE') {
      return formatResponse(await queryFns.delete(client, id));
    }

    return new Response(JSON.stringify({ message: 'Unsupported method!' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  };
}
