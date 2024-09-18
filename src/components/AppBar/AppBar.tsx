import * as Portal from '@radix-ui/react-portal';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import { Menu, Plus } from 'lucide-react';

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
  const isMobile = width <= 720;
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
                  LOGO
                </Drawer.Header>
                <Drawer.Body>
                  <NavLinks orientation="vertical" routes={navItems} />
                  <Button slotBefore={<Plus />} variant="solid">Check In Match</Button>
                </Drawer.Body>
              </Drawer.Content>
            </Drawer.Root>
          )}
          <div>
            LOGO
          </div>
          {!isMobile && (
            <>
              <NavLinks routes={navItems} />
              <IconButton round variant="solid"><Plus /></IconButton>
            </>
          )}
          <AccountMenu />
        </div>
      </div >
    </Portal.Root>
  );
};