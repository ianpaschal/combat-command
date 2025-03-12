import { ChangeEvent, useState } from 'react';
import { Close } from '@radix-ui/react-dialog';
import { useQuery } from 'convex/react';
import { Search } from 'lucide-react';

import { api, UserId } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { Avatar } from '~/components/generic/Avatar';
import { Button } from '~/components/generic/Button';
import { Dialog } from '~/components/generic/Dialog';
import { InputText } from '~/components/generic/InputText';
import { Label } from '~/components/generic/Label';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { Separator } from '~/components/generic/Separator';
import { getUserDisplayNameReact } from '~/utils/common/getUserDisplayNameReact';

import styles from './SelectPlayerDialog.module.scss';

export interface SelectMatchResultPlayerDialogProps {
  userId?: UserId;
  placeholder?: string;
  onConfirm: (data: { userId?: UserId, placeholder?: string }) => void,
  disabled?: boolean;
}

export const SelectPlayerDialog = ({
  userId,
  placeholder: existingPlaceholder,
  onConfirm,
  disabled = false,
}: SelectMatchResultPlayerDialogProps): JSX.Element => {
  const user = useAuth();
  const users = useQuery(api.users.fetchUserList.fetchUserList);

  const selectableUsers = (users || []).filter((u) => u._id !== user?._id && userId !== u._id);
  const existingUser = (users || []).find((u) => u._id === userId);

  const [placeholder, setPlaceholder] = useState<string>(existingPlaceholder || '');

  const handleChangePlaceholder = (e: ChangeEvent<HTMLInputElement>): void => {
    setPlaceholder(e.target.value);
  };

  const handleCloseComplete = (): void => {
    setPlaceholder(existingPlaceholder || '');
  };

  return (
    <Dialog
      title="Select a Player"
      width="small"
      onCloseComplete={handleCloseComplete}
      trigger={
        <button className={disabled ? styles.PlayerSelectButton : styles.PlayerSelectButtonActive} disabled={disabled}>
          <Avatar url={existingUser?.avatarUrl} className={styles.UserAvatar} />
          <div className={styles.UserDisplayName}>
            {existingPlaceholder}
            {existingUser && (
              getUserDisplayNameReact(existingUser)
            )}
          </div>
        </button>
      }
    >
      <div className={styles.Root}>
        <Label>Select a User</Label>
        <div className={styles.UserSelect}>
          <InputText className={styles.SearchBox} placeholder="Search" slotBefore={<Search />} />
          <ScrollArea className={styles.ScrollArea}>
            <div className={styles.UserList}>
              {selectableUsers.map((user, i) => (
                <div className={styles.UserListItem} key={i} >
                  <Avatar url={user.avatarUrl} className={styles.UserAvatar} />
                  <div className={styles.UserDisplayName}>
                    {getUserDisplayNameReact(user)}
                  </div>
                  <Close asChild>
                    <Button
                      className={styles.UserSelectButton}
                      onClick={() => {
                        onConfirm({ userId: user?._id });
                      }}
                    >
                      Select
                    </Button>
                  </Close>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <Separator text="or" />
        <Label>Placeholder</Label>
        <div className={styles.PlaceholderInput}>
          <InputText value={placeholder} onChange={handleChangePlaceholder} />
          <Close asChild>
            <Button onClick={() => onConfirm({ placeholder })} >
              Set
            </Button>
          </Close>
        </div>
      </div>
    </Dialog>
  );
};
