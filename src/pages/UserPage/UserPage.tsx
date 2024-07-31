import { Outlet } from 'react-router-dom';

import { PageWrapper } from '~/components/PageWrapper';

export const UserPage = (): JSX.Element => (
  <PageWrapper title="Some User Name">
    <Outlet />
  </PageWrapper>
);