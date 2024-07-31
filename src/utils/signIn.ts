import { AuthTokenResponsePassword } from '@supabase/supabase-js';

import { supabase } from '../supabaseClient';

export const signIn = async (
  email: string,
  password: string,
): Promise<AuthTokenResponsePassword> => await supabase.auth.signInWithPassword({
  email,
  password,
});