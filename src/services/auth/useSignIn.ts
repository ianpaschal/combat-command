import { useNavigate } from 'react-router-dom';
import { AuthTokenResponsePassword } from '@supabase/supabase-js';
import { useMutation } from '@tanstack/react-query';

import { SignInFormInput } from '~/pages/SignInPage/SignInPage';
import { supabase } from '~/supabaseClient';

type ResponseData = AuthTokenResponsePassword['data'];

const signIn = async ({ email, password }: SignInFormInput): Promise<ResponseData> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw new Error(error.message); // Throw the error to trigger onError
  }
  return data;
};

export const useSignIn = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      navigate('/');
    },
    onError: (error) => {
      console.log('Error signing in:', error);
    },
  });
};