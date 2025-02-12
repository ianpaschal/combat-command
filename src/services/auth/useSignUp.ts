import { useNavigate } from 'react-router-dom';
import { AuthResponse } from '@supabase/supabase-js';
import { useMutation } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
import { SignUpFormInput } from '~/pages/SignUpPage/SignUpPage';
import { handleError } from '~/services/handleError';
import { supabase } from '~/supabaseClient';

type ResponseData = AuthResponse['data'];

const signUp = async ({ email, password, username }: SignUpFormInput): Promise<ResponseData> => {
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
};

export const useSignUp = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      toast.success('You are now signed up!');
      navigate('/');
    },
    onError: handleError,
  });
};