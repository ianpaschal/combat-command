import { createContext } from 'react';

import { User } from '~/api';

export const AuthContext = createContext<User | null | undefined>(undefined);
