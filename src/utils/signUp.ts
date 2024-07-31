import { supabase } from '../supabaseClient';

export const signUp = async (email: string, password: string, redirectUrl?: string): Promise<void> => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: redirectUrl ? { 
      emailRedirectTo: redirectUrl,
    } : {},
  });
  if (error) {
    console.error(error);
  }
  return;
};
