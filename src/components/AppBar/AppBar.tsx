import * as Portal from '@radix-ui/react-portal';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import { Menu, Plus } from 'lucide-react';

import logo from '~/assets/logo.svg';
import { AccountMenu } from '~/components/AccountMenu';
import { Drawer } from '~/components/generic/Drawer';
import { IconButton } from '~/components/generic/IconButton';
import { NavLink, NavLinks } from '~/components/generic/NavLinks';
import { Button } from '../generic/Button';

import './AppBar.scss';

export interface AppBarProps {
  maxWidth?: string | number;
  navItems: NavLink[];
}

export const AppBar = ({
  maxWidth,
  navItems,
}: AppBarProps): JSX.Element => {
  const width = useWindowWidth();
  const isMobile = width <= 688;
  return (
    <Portal.Root>
      <div className="AppBarRoot">
        <div className="AppBarContent" style={{ maxWidth }}>
          {isMobile && (
            <Drawer.Root>
              <Drawer.Trigger asChild>
                <IconButton variant="ghost"><Menu /></IconButton>
              </Drawer.Trigger>
              <Drawer.Content side="left">
                <Drawer.Header title="Navigation" hideTitle>
                  <img src={logo} height={40} width={40} />
                </Drawer.Header>
                <Drawer.Body>
                  <NavLinks orientation="vertical" routes={navItems} />
                  <Button slotBefore={<Plus />} variant="solid">Check In Match</Button>
                </Drawer.Body>
              </Drawer.Content>
            </Drawer.Root>
          )}
          <img src={logo} height={40} width={40} />
          {!isMobile && (
            <NavLinks routes={navItems} />
          )}
          <AccountMenu />
        </div>
      </div >
    </Portal.Root>
  );
};