import { generatePath, useNavigate } from 'react-router-dom';
import * as Popover from '@radix-ui/react-popover';
import {
  Cog,
  LogOut,
  User,
} from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { Avatar } from '~/components/generic/Avatar';
import { Separator } from '~/components/generic/Separator';
import { useSignOut } from '~/services/auth/useSignOut';
import { PATHS } from '~/settings';

import styles from './AccountMenu.module.scss';

export const AccountMenu = (): JSX.Element | null => {
  const navigate = useNavigate();
  const user = useAuth();
  const { signOut } = useSignOut();

  if (!user) {
    return null;
  }

  const items = [
    {
      icon: <User />,
      label: 'Profile',
      onClick: (): void => {
        navigate(generatePath(PATHS.userProfile, { id: user!._id }));
      },
    },
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
    <Popover.Root>
      <Popover.Trigger className={styles.Trigger}>
        <Avatar url={user?.avatarUrl} />
      </Popover.Trigger>
      <Popover.Content className={styles.Content} align="end">
        <div className={styles.UserDisplayName}>
          {user.displayName}
        </div>
        <Separator />
        <div className={styles.Items} >
          {items.map((item, i) => (
            <Popover.Close key={i} asChild>
              <div className={styles.Item} onClick={item.onClick}>
                {item.icon}{item.label}
              </div>
            </Popover.Close>
          ))}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};
