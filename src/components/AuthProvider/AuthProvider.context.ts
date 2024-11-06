import { createContext } from 'react';
import { User } from '@supabase/supabase-js';

export type AuthContextValue = {
  user: User | null | undefined;
  profileId: string | null | undefined;
};

export const AuthContext = createContext<AuthContextValue>({
  user: undefined,
  profileId: undefined,
});