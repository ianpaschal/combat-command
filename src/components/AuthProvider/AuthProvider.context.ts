import { createContext } from 'react';
import { User } from '@supabase/supabase-js';

export const AuthContext = createContext<User | null>(null);