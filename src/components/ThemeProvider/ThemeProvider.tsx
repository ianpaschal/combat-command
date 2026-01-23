import { ReactNode, useEffect } from 'react';

import { useGetUserPreferences } from '~/services/userPreferences';
import { ThemeContext } from './ThemeProvider.context';
import { useResolvedTheme } from './ThemeProvider.hooks';

export interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({
  children,
}: ThemeProviderProps) => {
  const { data: userPreferences } = useGetUserPreferences({});
  const preference = userPreferences?.theme || 'system';
  const theme = useResolvedTheme(preference);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ preference, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
