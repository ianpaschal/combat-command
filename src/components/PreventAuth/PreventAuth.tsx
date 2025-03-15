import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '~/components/AuthProvider';
import { PATHS } from '~/settings';

export interface PreventAuthProps {
  children: ReactNode;
}

export const PreventAuth = ({ children }: PreventAuthProps) => {
  const user = useAuth();

  if (user) {
    return (
      <Navigate to={PATHS.dashboard} />
    );
  }

  return children;
};
