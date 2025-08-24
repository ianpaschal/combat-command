import { createContext } from 'react';

import { ThemePreference } from '~/api';

export const ThemeContext = createContext<ThemePreference | null>(null);
