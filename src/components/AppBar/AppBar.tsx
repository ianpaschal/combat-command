import { Link } from 'react-router-dom';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import { Coffee, Menu } from 'lucide-react';
import { Portal } from 'radix-ui';

import { AccountMenu } from '~/components/AccountMenu';
import { AppLogo } from '~/components/AppLogo';
import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { Drawer } from '~/components/generic/Drawer';
import { NavLink, NavLinks } from '~/components/generic/NavLinks';
import { getVisibleAppRoutes, mainRoutes } from '~/routes';
import {
  MAX_WIDTH,
  MIN_WIDTH_TABLET,
  PATHS,
} from '~/settings';

import styles from './AppBar.module.scss';

export interface AppBarProps {
  maxWidth?: string | number;
}

export const AppBar = ({
  maxWidth = MAX_WIDTH,
}: AppBarProps): JSX.Element => {
  const user = useAuth();
  const width = useWindowWidth();
  const isMobile = width <= MIN_WIDTH_TABLET;
  const routes = getVisibleAppRoutes(mainRoutes, !!user);
  const externalRoutes: NavLink[] = [
    {
      title: 'Buy Me a Coffee',
      path: 'https://buymeacoffee.com/combatcommand',
      icon: <Coffee />,
    },
  ];
  return (
    <Portal.Root className={styles.AppBar}>
      <div
        className={styles.AppBar_Content}
        style={{ maxWidth }}
        data-layout={isMobile ? 'mobile' : 'desktop'}
      >
        <div className={styles.AppBar_Links}>
          {isMobile ? (
            <Drawer
              side="left"
              trigger={<Button icon={<Menu />} round size="large" variant="ghost" />}
              header={
                <div className={styles.AppBar_DrawerHeader}>
                  <AppLogo className={styles.AppBar_Logo} />
                </div>
              }
            >
              <div className={styles.AppBar_NavLinks}>
                <NavLinks orientation="vertical" routes={routes} externalRoutes={externalRoutes} />
              </div>
            </Drawer>
          ) : (
            <NavLinks routes={routes} externalRoutes={externalRoutes} />
          )}
        </div>
        <AppLogo className={styles.AppBar_Logo} />
        <div className={styles.AppBar_Auth}>
          {user ? (
            <AccountMenu />
          ) : (
            <>
              <Link className={styles.AppBar_Link} to={PATHS.authSignIn}>Sign In</Link>
              <Link className={styles.AppBar_Link} to={PATHS.authSignUp}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </Portal.Root>
  );
};
