import { Link, Navigate } from 'react-router-dom';

import { useAuth } from '~/components/AuthProvider';
import { PageWrapper } from '~/components/PageWrapper';

export const LandingPage = (): JSX.Element => {

  const user = useAuth();

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <PageWrapper>
      <h2>Welcome to battle tools</h2>
      <Link to="/sign-in">Sign In</Link> | <Link to="/sign-up">Register</Link>
    </PageWrapper>
  );
};