import { Link } from 'react-router-dom';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import { Menu } from 'lucide-react';
import { Portal } from 'radix-ui';

import { AccountMenu } from '~/components/AccountMenu';
import { AppLogo } from '~/components/AppLogo';
import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { Drawer } from '~/components/generic/Drawer';
import { NavLinks } from '~/components/generic/NavLinks';
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
  return (
    <Portal.Root>
      <div className={styles.Root}>
        <div className={styles.Content} style={{ maxWidth }}>
          {isMobile && (
            <Drawer
              side="left"
              trigger={
                <Button variant="ghost" size="large" round>
                  <Menu />
                </Button>
              }
              header={
                <div className={styles.DrawerHeader}>
                  <AppLogo className={styles.Logo} />
                </div>
              }
            >
              <div className={styles.NavLinks}>
                <NavLinks orientation="vertical" routes={routes} />
              </div>
            </Drawer>
          )}
          <AppLogo className={styles.Logo} />
          {!isMobile && (
            <NavLinks routes={routes} />
          )}
          {user ? (
            <AccountMenu />
          ) : (
            <div className={styles.AuthLinks}>
              <Link to={PATHS.authSignIn}>Sign In</Link>
              <Link to={PATHS.authSignUp}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </Portal.Root>
  );
};
