import { useNavigate } from 'react-router-dom';
import { AuthResponse } from '@supabase/supabase-js';
import { useMutation } from '@tanstack/react-query';

import { SignUpFormInput } from '~/pages/SignUpPage/SignUpPage';
import { supabase } from '~/supabaseClient';

type ResponseData = AuthResponse['data'];

const signUp = async ({ email, password, username }: SignUpFormInput): Promise<ResponseData> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { 
      emailRedirectTo: '/settings/profile',
      data: {
        username,
      },
    },
  });
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const useSignUp = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      navigate('/'); // TODO: Navigate to notifications page
    },
    onError: (error) => {
      console.error('Error signing up:', error);
    },
  });
};