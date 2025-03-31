import { ReactNode, useEffect } from 'react';

import { useGetUserPreferences } from '~/services/userPreferences';
import { ThemeContext } from './ThemeProvider.context';

export interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({
  children,
}: ThemeProviderProps) => {
  const { data: userPreferences } = useGetUserPreferences({});
  const theme = userPreferences?.theme || 'system';
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateClass = () => {
      if (theme === 'system') {
        if (mediaQuery.matches) {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
      } else if (theme === 'dark') {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    };
    updateClass(); // Set initial state
    if (theme === 'system') {
      mediaQuery.addEventListener('change', updateClass); // Listen for changes
    } else {
      mediaQuery.removeEventListener('change', updateClass);
    }
    return () => mediaQuery.removeEventListener('change', updateClass); // Cleanup
  }, [theme]);
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
