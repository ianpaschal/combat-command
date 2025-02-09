import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { setToast, ToastSeverity } from '~/components/ToastProvider';
import { ForgotPasswordFormInput } from '~/pages/ForgotPasswordPage/ForgotPasswordPage';
import { handleError } from '~/services/handleError';
import { supabase } from '~/supabaseClient';

const resetPassword = async ({ email }: ForgotPasswordFormInput): Promise<void> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) {
    throw error;
  }
};

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      setToast({
        title: 'Check your email',
        description: 'A password reset link has been sent to your email.',
        severity: ToastSeverity.Info,
      });
      navigate('/');
    },
    onError: handleError,
  });
};