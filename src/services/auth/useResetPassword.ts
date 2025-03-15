import {
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '@convex-dev/auth/react';

import { useAuth } from '~/components/AuthProvider';
import { toast } from '~/components/ToastProvider';

type ResetPasswordInput = {
  code: string;
  email: string;
  newPassword: string;
};

export const useResetPassword = () => {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const user = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const redirectPath = useRef<string>();

  /*
   * Throughout the app, we use the presence of a User as the method of determining if a user is
   * logged in. Since the signIn() method doesn't actually set that user, we shouldn't consider the
   * user ACTUALLY signed in until that User is actually set in the AuthProvider.
   * 
   * If this check is removed, the UI will flicker as the user is bounced back to the sign-in page.
   */
  useEffect(() => {
    if (user) {
      setLoading(false);
      toast.success('Successfully updated password!');
      if (redirectPath.current) {
        navigate(redirectPath.current);
      }
    }
  }, [user, setLoading, navigate]);

  return {
    resetPassword: async (data: ResetPasswordInput, redirectTo: string): Promise<void> => {
      setLoading(true);
      redirectPath.current = redirectTo;
      await signIn('password', {
        ...data,
        flow: 'reset-verification',
      }).catch((error) => {
        setLoading(false);
        console.error(error);
        toast.error(error.message);
      });
    },
    loading,
  };
};
