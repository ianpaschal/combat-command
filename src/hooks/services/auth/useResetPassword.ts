import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { ForgotPasswordFormInput } from '~/pages/ForgotPasswordPage/ForgotPasswordPage';
import { supabase } from '~/supabaseClient';

const resetPassword = async ({ email }: ForgotPasswordFormInput): Promise<void> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) {
    throw new Error(error.message); // Throw the error to trigger onError
  }
};

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      navigate('/');
    },
    onError: (error) => {
      console.log('Error sending reset password email:', error);
    },
  });
};