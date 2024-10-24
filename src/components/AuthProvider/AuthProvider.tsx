import {
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { User } from '@supabase/supabase-js';
import { LoaderCircle } from 'lucide-react';

import { ChangePasswordDialog } from '~/components/ChangePasswordDialog';
import { supabase } from '~/supabaseClient';
import { AuthContext } from './AuthProvider.context';

import styles from './AuthProvider.module.scss';

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatePasswordDialogOpen, setUpdatePasswordDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (import.meta.env.VITE_DISABLE_AUTH === 'true') {
      setUser({
        id: '853ff12a-259d-456f-8d03-a4942ac6e8db',
        app_metadata: {},
        user_metadata: {},
        aud: 'string',
        created_at: new Date().toISOString(),
      });
      setLoading(false);
    } else {
      const getUser = async () => {
        const { data } = await supabase.auth.getUser();
        const { user: currentUser } = data;
        if (currentUser) {
          setUser(currentUser);
        }
        setLoading(false);
      };
      getUser();
      const { data } = supabase.auth.onAuthStateChange(async (event, session): Promise<void> => {
        if (event === 'SIGNED_IN' && session?.user) {
          return setUser(session.user);
        }
        if (event === 'PASSWORD_RECOVERY' && session?.user) {
          setUpdatePasswordDialogOpen(true);
          return setUser(session.user);
        }
        if (event === 'SIGNED_OUT') {
          return setUser(null);
        }
      });
      return () => {
        data.subscription.unsubscribe();
      };
    }
  }, []);

  if (loading) {
    return (
      <div className={styles.LoadingOverlay}>
        <LoaderCircle className={styles.LoadingIcon} />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={user}>
      {children}
      <ChangePasswordDialog
        open={updatePasswordDialogOpen}
        onOpenChange={setUpdatePasswordDialogOpen}
        preventCancel
      />
    </AuthContext.Provider>
  );
};
