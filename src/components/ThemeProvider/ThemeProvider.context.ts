import { createContext } from 'react';

import { ThemePreference } from '~/api';
import { ResolvedTheme } from './ThemeProvider.hooks';

export interface ThemeContextValue {
  preference: ThemePreference;
  theme: ResolvedTheme;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
