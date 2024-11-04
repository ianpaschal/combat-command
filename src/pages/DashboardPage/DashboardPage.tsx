import { PageWrapper } from '~/components/PageWrapper';
import { RequireAuth } from '~/components/RequireAuth';

export const DashboardPage = (): JSX.Element => (
  <RequireAuth>
    <PageWrapper title="Dashboard">
      Hello world!
    </PageWrapper>
  </RequireAuth>
);