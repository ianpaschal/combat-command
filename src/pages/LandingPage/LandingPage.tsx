import { Link } from 'react-router-dom';

import { PageWrapper } from '~/components/PageWrapper';
import { PreventAuth } from '~/components/PreventAuth';

export const LandingPage = (): JSX.Element => (
  <PreventAuth>
    <PageWrapper>
      <h2>Welcome to battle tools</h2>
      <Link to="/sign-in">Sign In</Link> | <Link to="/sign-up">Register</Link>
    </PageWrapper>
  </PreventAuth>
);
