import { createContext } from 'react';

import { CurrentUser } from '~/api';

export const AuthContext = createContext<CurrentUser | null | undefined>(undefined);
