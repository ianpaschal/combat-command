import * as Popover from '@radix-ui/react-popover';
import { LogOut } from 'lucide-react';

import { Avatar } from '~/components/generic/Avatar';
import { NavLinks } from '~/components/generic/NavLinks';
import { getNavLinksByVisibility } from '~/routes';
import { createCn } from '~/utils/componentLib/createCn';
import { Button } from '../generic/Button';

import './AccountMenu.scss';

const cn = createCn('AccountMenu');

export const AccountMenu = (): JSX.Element => {
  const accountMenuLinks = getNavLinksByVisibility('accountMenu');
  return (
    <Popover.Root >
      <Popover.Trigger className={cn('_Trigger')}>
        <Avatar displayName="Ian" />
      </Popover.Trigger>
      <Popover.Content className={cn('_Content')} align="end">
        <NavLinks orientation="vertical" routes={accountMenuLinks} wrapper={(i, link) => <Popover.Close key={i} asChild>{link}</Popover.Close>} />
        <Button variant="ghost"><LogOut />Sign Out</Button>
      </Popover.Content>
    </Popover.Root>
  );
};
AccountMenu.displayName = cn();