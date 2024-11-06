import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '~/components/AuthProvider';

export interface RequireAuthProps {
  children: ReactNode;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const { user, profileId } = useAuth();
  const location = useLocation();

  if (user === null || profileId === null) {
    return (
      <Navigate to={'/sign-in'} replace state={{ path: location.pathname }} />
    );
  }

  return children;
};