import { useNavigate } from 'react-router-dom';
import { AuthTokenResponsePassword } from '@supabase/supabase-js';
import { useMutation } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
import { SignInFormInput } from '~/pages/SignInPage/SignInPage';
import { handleError } from '~/services/handleError';
import { supabase } from '~/supabaseClient';

type ResponseData = AuthTokenResponsePassword['data'];

const signIn = async ({ email, password }: SignInFormInput): Promise<ResponseData> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw error;
  }
  return data;
};

export const useSignIn = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      toast.success('You are now signed in!');
      navigate('/');
    },
    onError: handleError,
  });
};