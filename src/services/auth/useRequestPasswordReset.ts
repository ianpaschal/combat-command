import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '@convex-dev/auth/react';

import { toast } from '~/components/ToastProvider';

type RequestPasswordResetInput = {
  email: string;
};

export const useRequestPasswordReset = () => {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const redirectPath = useRef<string>();
  return {
    requestPasswordReset: async (data: RequestPasswordResetInput, redirectTo: string): Promise<void> => {
      setLoading(true);
      redirectPath.current = redirectTo;
      await signIn('password', {
        ...data,
        flow: 'reset',
      }).catch((error) => {
        console.error(error);
        toast.error(error.message);
      }).finally(() => {
        setLoading(false);
        toast.success('Code sent!');
        if (redirectPath.current) {
          navigate(redirectPath.current);
        }
      });
    },
    loading,
  };
};
