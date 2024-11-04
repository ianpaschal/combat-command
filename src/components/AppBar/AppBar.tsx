import { Link } from 'react-router-dom';
import * as Portal from '@radix-ui/react-portal';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import { Menu } from 'lucide-react';

import { AccountMenu } from '~/components/AccountMenu';
import { AppLogo } from '~/components/AppLogo';
import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { Drawer } from '~/components/generic/Drawer';
import { NavLink, NavLinks } from '~/components/generic/NavLinks';
import { MIN_WIDTH_TABLET } from '~/settings';

import styles from './AppBar.module.scss';

export interface AppBarProps {
  maxWidth?: string | number;
  navItems: NavLink[];
}

export const AppBar = ({
  maxWidth,
  navItems,
}: AppBarProps): JSX.Element => {
  const { user } = useAuth();
  const width = useWindowWidth();
  const isMobile = width <= MIN_WIDTH_TABLET;
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
                <NavLinks orientation="vertical" routes={navItems} />
              </div>
            </Drawer>
          )}
          <AppLogo className={styles.Logo} />
          {!isMobile && (
            <NavLinks routes={navItems} />
          )}
          {user ? (
            <AccountMenu />
          ) : (
            <div className={styles.AuthLinks}>
              <Link to="/sign-in">Sign In</Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </div>
      </div >
    </Portal.Root>
  );
};