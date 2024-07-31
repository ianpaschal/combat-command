import { Card } from '~/components/generic/Card';
import { PageWrapper } from '~/components/PageWrapper';
import { RequireAuth } from '~/components/RequireAuth';

export const DashboardPage = (): JSX.Element => (
  <RequireAuth>
    <PageWrapper title="Dashboard">
      <Card>
        My Tournaments
      </Card>
      <Card>
        My Matches
      </Card>
    </PageWrapper>
  </RequireAuth>
);