import { useContext } from 'react';

import { AuthFlowContext } from './AuthPage.context';

export const useAuthFlow = () => {
  const context = useContext(AuthFlowContext);
  if (!context) {
    throw Error('useAuthFlow must be used within <AuthPage />!');
  }
  return context;
};
