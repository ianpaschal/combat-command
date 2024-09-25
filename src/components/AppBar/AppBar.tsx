import * as Portal from '@radix-ui/react-portal';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import { Menu, Plus } from 'lucide-react';

import { AccountMenu } from '~/components/AccountMenu';
import { AppLogo } from '~/components/AppLogo';
import { Button } from '~/components/generic/Button';
import { Drawer } from '~/components/generic/Drawer';
import { NavLink, NavLinks } from '~/components/generic/NavLinks';
import { createCn } from '~/utils/componentLib/createCn';

import './AppBar.scss';

export interface AppBarProps {
  maxWidth?: string | number;
  navItems: NavLink[];
}

const cn = createCn('AppBar');

export const AppBar = ({
  maxWidth,
  navItems,
}: AppBarProps): JSX.Element => {
  const width = useWindowWidth();
  const isMobile = width <= 688;
  return (
    <Portal.Root>
      <div className={cn('__Root')}>
        <div className={cn('__Content')} style={{ maxWidth }}>
          {isMobile && (
            <Drawer.Root>
              <Drawer.Trigger asChild>
                <Button variant="ghost"><Menu /></Button>
              </Drawer.Trigger>
              <Drawer.Content side="left">
                <Drawer.Header title="Navigation" hideTitle>
                  <AppLogo className={cn('__Logo')} />
                </Drawer.Header>
                <Drawer.Body>
                  <NavLinks orientation="vertical" routes={navItems} />
                  <Button variant="solid">Check In Match</Button>
                </Drawer.Body>
              </Drawer.Content>
            </Drawer.Root>
          )}
          {/* <img src={logo} height={40} width={40} /> */}
          <AppLogo className={cn('__Logo')} />
          {!isMobile && (
            <NavLinks routes={navItems} />
          )}
          <AccountMenu />
        </div>
      </div >
    </Portal.Root>
  );
};