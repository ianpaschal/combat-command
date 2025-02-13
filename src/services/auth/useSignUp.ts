import { AuthResponse } from '@supabase/supabase-js';
import { useMutation } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
import { SignUpFormInput } from '~/pages/SignUpPage/SignUpPage';
import { handleError } from '~/services/handleError';
import { supabase } from '~/supabaseClient';

type ResponseData = AuthResponse['data'];

export const useSignUp = () => useMutation({
  mutationFn: async ({ email, password, username }: SignUpFormInput): Promise<ResponseData> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        emailRedirectTo: 'https://www.combatcommand.net/settings/profile',
        data: {
          username,
        },
      },
    });
    if (error) {
      throw error;
    }
    return data;
  },
  onSuccess: () => {
    toast.success('You are now signed up!');
  },
  onError: handleError,
});