import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { toast } from '~/components/ToastProvider';
// import { ForgotPasswordFormInput } from '~/pages/ForgotPasswordPage/ForgotPasswordPage';
import { handleError } from '~/services/handleError';

const resetPassword = async (): Promise<void> => {
  // TODO: Add Convex password resets
};

export const useResetPassword = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.info('Check your email', {
        description: 'A password reset link has been sent to your email.',
      });
      navigate('/');
    },
    onError: handleError,
  });
};
