import {
  useContext,
  useEffect,
  useState,
} from 'react';

import { ThemePreference } from '~/api';
import { ThemeContext } from './ThemeProvider.context';

export type ResolvedTheme = 'light' | 'dark';

export const useResolvedTheme = (preference: ThemePreference): ResolvedTheme => {
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (preference === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return preference;
  });

  useEffect(() => {
    if (preference !== 'system') {
      setResolvedTheme(preference);
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = () => {
      setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
    };

    updateTheme();
    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [preference]);

  return resolvedTheme;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw Error('useTheme must be used within a <ThemeProvider />!');
  }
  return context;
};
