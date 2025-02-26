import {
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '@convex-dev/auth/react';

import { useAuth } from '~/components/AuthProvider';
import { toast } from '~/components/ToastProvider';

export const useSignOut = () => {
  const { signOut } = useAuthActions();
  const navigate = useNavigate();
  const user = useAuth();
  const [isLoading, setLoading] = useState<boolean>(false);
  const redirectPath = useRef<string>();

  /*
   * Throughout the app, we use the presence of a User as the method of determining if a user is
   * logged in. Since the signOut() method doesn't actually remove that user, we shouldn't consider
   * the user ACTUALLY signed out until that User is actually removed in the AuthProvider.
   * 
   * If this check is removed, the UI will flicker as the user is bounced between pages by the
   * <RequireAuth/> and <PreventAuth/> wrappers.
   */
  useEffect(() => {
    if (user === null) {
      setLoading(false);
      if (redirectPath.current) {
        navigate(redirectPath.current);
      }
    }
  }, [user, setLoading, navigate]);

  return {
    signOut: async (redirectTo: string): Promise<void> => {
      setLoading(true);
      redirectPath.current = redirectTo;
      await signOut().catch((error) => {
        toast.error(error.message);
      });
    },
    isLoading,
  };
};
