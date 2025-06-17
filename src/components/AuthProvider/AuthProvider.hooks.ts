import { useContext } from 'react';

import { AuthContext } from './AuthProvider.context';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    return null;
  }
  return context;
};
