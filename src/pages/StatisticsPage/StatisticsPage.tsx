import { Card } from '~/components/generic/Card';
import { PageWrapper } from '~/components/PageWrapper';
import { RequireAuth } from '~/components/RequireAuth';

export const StatisticsPage = (): JSX.Element => (
  <RequireAuth>
    <PageWrapper title="Statistics">
      <Card>
        My Tournaments
      </Card>
      <Card>
        My Matches
      </Card>
    </PageWrapper>
  </RequireAuth>
);