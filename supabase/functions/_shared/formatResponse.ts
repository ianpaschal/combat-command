import { PostgrestSingleResponse } from 'jsr:@supabase/supabase-js@2';

import { corsHeaders } from './cors.ts';
import { mapSupabaseErrorToHttpStatus } from './mapSupabaseErrorToHttpStatus.ts';

const headers = { ...corsHeaders, 'Content-Type': 'application/json' };

export function formatResponse({ data, error }: PostgrestSingleResponse<unknown>): Response {
  if (error) {
    return new Response(JSON.stringify(error), {
      headers,
      status: mapSupabaseErrorToHttpStatus(error.code),
    });
  }
  return new Response(JSON.stringify(data), {
    headers,
    status: 200,
  });
}
