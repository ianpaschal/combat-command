import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '~/components/AuthProvider';
import { PATHS } from '~/settings';

export interface RequireAuthProps {
  children: ReactNode;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const user = useAuth();
  const location = useLocation();

  if (user === null) {
    console.info('Not signed in, will redirect to sign-in page.');
    return (
      <Navigate to={PATHS.auth} replace state={{ path: location.pathname }} />
    );
  }

  return children;
};
