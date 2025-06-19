import { ChangeEvent, useState } from 'react';
import { Search, X } from 'lucide-react';

import { UserId } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import {
  ControlledDialog,
  DialogActions,
  DialogHeader,
} from '~/components/generic/Dialog';
import { InputText } from '~/components/generic/InputText';
import { Label } from '~/components/generic/Label';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { Separator } from '~/components/generic/Separator';
import { IdentityBadge } from '~/components/IdentityBadge';
import { useUserSelectDialog } from '~/components/UserSelectDialog/UserSelectDialog.hooks';
import { useGetUsers } from '~/services/users';

import styles from './UserSelectDialog.module.scss';

export type UserSelectDialogValue = { userId?: UserId, placeholder?: string };

export interface UserSelectDialogProps {
  allowPlaceholder?: boolean;
  disabled?: boolean;
  excludeUserIds?: UserId[];
  id: string;
  value: UserSelectDialogValue;
  onConfirm: (data: UserSelectDialogValue) => void,
  placeholder?: string;
}

export const UserSelectDialog = ({
  allowPlaceholder = true,
  excludeUserIds = [],
  id: key,
  value,
  onConfirm,
}: UserSelectDialogProps): JSX.Element => {
  const user = useAuth();
  const { id, close } = useUserSelectDialog(key);

  // Search
  const [search, setSearch] = useState<string>('');
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
  };
  const { data: userList } = useGetUsers({ search });

  // Placeholder (hidden by default)
  const [placeholder, setPlaceholder] = useState<string>(value?.placeholder || '');
  const handleChangePlaceholder = (e: ChangeEvent<HTMLInputElement>): void => {
    setPlaceholder(e.target.value);
  };
  const handleSetPlaceholder = (): void => {
    onConfirm({ placeholder });
    close();
  };

  // Remove own user, and currently selected user
  const selectableUsers = (userList || []).filter((u) => {
    const isSelf = u._id === user?._id;
    const isSelected = u._id === value?.userId;
    const isExcluded = excludeUserIds.includes(u._id);
    return !isSelf && !isSelected && !isExcluded;
  });
  const selectedUser = (userList || []).find((u) => u._id === value?.userId);

  const handleSelect = (userId: UserId): void => {
    onConfirm({ userId });
    close();
    setSearch('');
    setPlaceholder('');
  };
  const handleClear = (): void => {
    onConfirm({ userId: '' as UserId });
    // close();
  };

  return (
    <ControlledDialog id={id} width="small">
      <DialogHeader title="Select User" onCancel={close} />
      <div className={styles.UserSelectDialog}>
        <div className={styles.UserSelectDialog_UserSelectSection}>
          <InputText
            className={styles.UserSelectDialog_SearchBox}
            placeholder="Search"
            slotBefore={<Search />}
            size="large"
            onChange={handleChangeSearch}
            value={search}
          />
          {selectedUser && (
            <div className={styles.UserSelectDialog_SelectedUser}>
              {/* <Label className={styles.UserSelectDialog_SelectedUser_Label}>
                Selected
              </Label> */}
              <IdentityBadge
                className={styles.UserSelectDialog_SelectedUser_Badge}
                user={selectedUser}
                size="small"
              />
              <Button
                className={styles.UserSelectDialog_SelectedUser_Clear}
                size="small"
                variant="ghost"
                onClick={handleClear}
              >
                <X />
              </Button>
            </div>
          )}
          <ScrollArea className={styles.UserSelectDialog_ScrollArea}>
            <div className={styles.UserSelectDialog_UserList}>
              {selectableUsers.map((user, i) => (
                <div className={styles.UserSelectDialog_UserListItem} key={i}>
                  <IdentityBadge user={user} size="small" />
                  <Button onClick={() => handleSelect(user?._id)}>
                    Select
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        {allowPlaceholder && (
          <>
            <Separator text="or" />
            <Label>Placeholder</Label>
            <div className={styles.UserSelectDialog_PlaceholderInput}>
              <InputText value={placeholder} onChange={handleChangePlaceholder} />
              <Button onClick={handleSetPlaceholder}>
                Set
              </Button>
            </div>
          </>
        )}
      </div>
      <DialogActions>
        <Button variant="secondary" onClick={close}>Close</Button>
      </DialogActions>
    </ControlledDialog>
  );
};
