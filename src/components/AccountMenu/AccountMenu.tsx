import { useNavigate } from 'react-router-dom';
import * as Popover from '@radix-ui/react-popover';
import { Cog, LogOut } from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { Avatar } from '~/components/generic/Avatar';
import { Button } from '~/components/generic/Button';
import { Separator } from '~/components/generic/Separator';
import { useSignOut } from '~/services/auth/useSignOut';
import { getUserDisplayName } from '~/utils/common/getUserDisplayName';

import styles from './AccountMenu.module.scss';

export const AccountMenu = (): JSX.Element => {
  const user = useAuth();
  const { signOut } = useSignOut();

  const displayName = user ? getUserDisplayName(user) : 'Unknown User';

  const navigate = useNavigate();
  const items = [
    {
      icon: <Cog />,
      label: 'Settings',
      onClick: (): void => {
        navigate('/settings/profile');
      },
    },
    {
      icon: <LogOut />,
      label: 'Sign Out',
      onClick: () => signOut('/'),
    },
  ];
  return (
    <Popover.Root >
      <Popover.Trigger className={styles.Trigger}>
        <Avatar url={user?.avatarUrl} />
      </Popover.Trigger>
      <Popover.Content className={styles.Content} align="end">
        <span className={styles.UserDisplayName}>
          {displayName}
        </span>

        <Separator />
        {items.map((item, i) => (
          <Popover.Close key={i} asChild>
            <Button variant="ghost" onClick={item.onClick}>
              {item.icon}{item.label}
            </Button>
          </Popover.Close>
        ))}
      </Popover.Content>
    </Popover.Root>
  );
};
