import { Outlet } from 'react-router-dom';

import { Card } from '~/components/generic/Card';
import { NavLinks } from '~/components/generic/NavLinks';
import { PageWrapper } from '~/components/PageWrapper';
import { RequireAuth } from '~/components/RequireAuth';
import { useRouteTitle } from '~/hooks/useRouteTitle';
import { getNavLinksByPath } from '~/routes';

import styles from './SettingsPage.module.scss';

export const SettingsPage = (): JSX.Element => {
  const links = getNavLinksByPath('/settings');
  const title = useRouteTitle();
  return (
    <RequireAuth>
      <PageWrapper title={'Settings'}>
        <div className={styles.Root}>
          <div className={styles.Navigation}>
            <NavLinks routes={links} orientation="vertical" size="small" />
          </div>
          <Card title={title} className={styles.Content}>
            <Outlet />
          </Card>
        </div>
      </PageWrapper>
    </RequireAuth>
  );
};
