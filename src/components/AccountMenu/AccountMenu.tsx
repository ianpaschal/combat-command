import * as Popover from '@radix-ui/react-popover';
import { LogOut } from 'lucide-react';

import { Avatar } from '~/components/generic/Avatar';
import { NavLinks, RouteConfig } from '~/components/generic/NavLinks';
import { createCn } from '~/utils/componentLib/createCn';
// import { routes } from '~/routes';
import { Button } from '../generic/Button';

import './AccountMenu.scss';

const accountMenuLinks: RouteConfig[] = [];

const cn = createCn('AccountMenu');

export const AccountMenu = (): JSX.Element => (
  <Popover.Root >
    <Popover.Trigger className={cn('__Trigger')}>
      <Avatar displayName="Ian" />
    </Popover.Trigger>
    <Popover.Content className={cn('__Content')} align="start">
      <NavLinks orientation="vertical" routes={accountMenuLinks} />
      <Button variant="ghost"><LogOut />Sign Out</Button>
    </Popover.Content>
  </Popover.Root>
);
AccountMenu.displayName = cn();