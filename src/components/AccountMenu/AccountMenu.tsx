import { useNavigate } from 'react-router-dom';
import * as Popover from '@radix-ui/react-popover';
import { Cog, LogOut } from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { Avatar } from '~/components/generic/Avatar';
import { Button } from '~/components/generic/Button';
import { Separator } from '~/components/generic/Separator';
import { useFetchUserProfile } from '~/services/userProfile/useFetchUserProfile';
import { supabase } from '~/supabaseClient';
import { getUserDisplayName } from '~/utils/common/getUserDisplayName';

import styles from './AccountMenu.module.scss';

export const AccountMenu = (): JSX.Element => {
  const { user } = useAuth();
  const { data: userProfile } = useFetchUserProfile(user?.id);
  const displayName = userProfile ? getUserDisplayName(userProfile) : 'Unknown User';
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
      onClick: async (): Promise<void> => {
        await supabase.auth.signOut();
        navigate('/');
      },
    },
  ];
  return (
    <Popover.Root >
      <Popover.Trigger className={styles.Trigger}>
        <Avatar userId={userProfile?.user_id} />
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