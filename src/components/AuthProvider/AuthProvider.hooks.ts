import { useContext } from 'react';

import { AuthContext } from './AuthProvider.context';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw Error('Tried to use auth context outside of provider');
  }
  return context;
};