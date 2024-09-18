import {
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { User } from '@supabase/supabase-js';
import { LoaderCircle } from 'lucide-react';

import { supabase } from '~/supabaseClient';
import { AuthContext } from './AuthProvider.context';

import './AuthProvider.scss';

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getUser();
      const { user: currentUser } = data;
      if (currentUser) {
        setUser(currentUser);
      }
      setLoading(false);
    };
    getUser();
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="AuthProvider--loading">
        <LoaderCircle className="AuthProvider__LoadingIcon" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={user}>
      {children}
    </AuthContext.Provider>
  );
};
