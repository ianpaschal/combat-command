import * as Popover from '@radix-ui/react-popover';
import { LogOut } from 'lucide-react';

import { Avatar } from '~/components/generic/Avatar';
import { NavLinks, RouteConfig } from '~/components/generic/NavLinks';
// import { routes } from '~/routes';
import { Button } from '../generic/Button';

import './AccountMenu.scss';

const accountMenuLinks: RouteConfig[] = [];

export const AccountMenu = (): JSX.Element => (
  <Popover.Root >
    <Popover.Trigger className="AccountMenuTrigger">
      <Avatar displayName="Ian" />
    </Popover.Trigger>
    <Popover.Content className="AccountMenuContent" align="start">
      <NavLinks orientation="vertical" routes={accountMenuLinks} />
      <Button slotAfter={<LogOut />} variant="ghost">Sign Out</Button>
    </Popover.Content>
  </Popover.Root>
);