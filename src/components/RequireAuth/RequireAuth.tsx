import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '~/components/AuthProvider';

export interface RequireAuthProps {
  children: ReactNode;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const user = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate to={'/auth/sign-in'} replace state={{ path: location.pathname }} />
    );
  }

  return children;
};