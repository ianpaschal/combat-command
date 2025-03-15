import { Link } from 'react-router-dom';

import { PageWrapper } from '~/components/PageWrapper';
import { PreventAuth } from '~/components/PreventAuth';
import { PATHS } from '~/settings';

export const LandingPage = (): JSX.Element => (
  <PreventAuth>
    <PageWrapper>
      <h2>Welcome to Combat Command</h2>
      <Link to={PATHS.authSignIn}>Sign In</Link> | <Link to={PATHS.authSignUp}>Sign Up</Link>
    </PageWrapper>
  </PreventAuth>
);
