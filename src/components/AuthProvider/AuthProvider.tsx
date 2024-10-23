import {
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthChangeEvent, User } from '@supabase/supabase-js';
import { LoaderCircle } from 'lucide-react';

import { Dialog } from '~/components/generic/Dialog';
import { supabase } from '~/supabaseClient';
import { createCn } from '~/utils/componentLib/createCn';
import { AuthContext } from './AuthProvider.context';

import './AuthProvider.scss';

export interface AuthProviderProps {
  children: ReactNode;
}

const cn = createCn('AuthProvider');

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  // const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatePasswordDialogOpen, setUpdatePasswordDialogOpen] = useState<boolean>(false);
  const [lastAuthEvent, setLastAuthEvent] = useState<AuthChangeEvent | undefined>(undefined);

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
        // setLastAuthEvent(event);
        // if (session?.user) {
        //   setUser(session.user);
        // } else {
        //   setUser(null);
        // }
        if (event === 'SIGNED_IN' && session?.user) {
          return setUser(session.user);
        }
        if (event === 'PASSWORD_RECOVERY') {
          console.log('event', event, 'session', session);
          setUpdatePasswordDialogOpen(true);
          // navigate('/update-password');
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
      <div className={cn('-loading')}>
        <LoaderCircle className={cn('_LoadingIcon')} />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={user}>
      {children}
      <Dialog
        open={updatePasswordDialogOpen}
        onOpenChange={setUpdatePasswordDialogOpen}
        title="password change"
        preventCancel
      />
    </AuthContext.Provider>
  );
};
