import { createContext } from 'react';
import { User } from '@supabase/supabase-js';

export type AuthContextValue = {
  user: User | null;
  profileId: string | null;
};

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  profileId: null,
});