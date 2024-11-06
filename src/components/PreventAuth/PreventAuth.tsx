import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '~/components/AuthProvider';

export interface PreventAuthProps {
  children: ReactNode;
}

export const PreventAuth = ({ children }: PreventAuthProps) => {
  const { user, profileId } = useAuth();

  if (!!user && !!profileId) {
    return (
      <Navigate to={'/dashboard'} />
    );
  }

  return children;
};