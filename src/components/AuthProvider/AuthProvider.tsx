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
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [profileId, setProfileId] = useState<string | null | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatePasswordDialogOpen, setUpdatePasswordDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: auth } = await supabase.auth.getUser();
      console.log('auth', auth);
      if (auth.user) {
        setUser(auth.user);
      } else {
        setUser(null);
        setProfileId(null);
      }
    };
    console.log('getting user');
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
  }, []);

  useEffect(() => {
    const getUserProfile = async () => {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();
      setProfileId(profile?.id as string || null);
    };
    if (user) {
      console.log('getting profile');
      getUserProfile();
    }
  }, [user]);

  useEffect(() => {
    if (user !== undefined && profileId !== undefined) {
      setLoading(false);
    }
  }, [user, profileId]);

  if (loading) {
    return (
      <div className={styles.LoadingOverlay}>
        <LoaderCircle className={styles.LoadingIcon} />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, profileId }}>
      {children}
      <ChangePasswordDialog
        open={updatePasswordDialogOpen}
        onOpenChange={setUpdatePasswordDialogOpen}
        preventCancel
      />
    </AuthContext.Provider>
  );
};
