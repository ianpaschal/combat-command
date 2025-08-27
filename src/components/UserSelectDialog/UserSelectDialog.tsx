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
import { toast } from '~/components/ToastProvider';
import { UserForm } from '~/components/UserSelectDialog/components/UserForm';
import { UserSubmitData } from '~/components/UserSelectDialog/components/UserForm/UserForm.schema';
import { useUserSelectDialog } from '~/components/UserSelectDialog/UserSelectDialog.hooks';
import { useGetUsers, useInviteUser } from '~/services/users';

import styles from './UserSelectDialog.module.scss';

export type UserSelectDialogValue = { userId?: UserId, placeholder?: string };

export interface UserSelectDialogProps {
  allowInvite?: boolean;
  allowPlaceholder?: boolean;
  disabled?: boolean;
  excludeUserIds?: UserId[];
  id: string;
  value: UserSelectDialogValue;
  onConfirm: (data: UserSelectDialogValue) => void,
  placeholder?: string;
}

export const UserSelectDialog = ({
  allowInvite = false,
  allowPlaceholder = true,
  excludeUserIds = [],
  id: key,
  value,
  onConfirm,
}: UserSelectDialogProps): JSX.Element => {
  const user = useAuth();
  const { id, close } = useUserSelectDialog(key);
  const { action: inviteUser } = useInviteUser({
    onSuccess(response) {
      toast.success(`Successfully invited ${response.givenName} ${response.familyName} to CombatCommand!`);
    },
  });

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
  const handleInviteUser = async (data: UserSubmitData): Promise<void> => {
    const user = await inviteUser({
      ...data,
      appUrl: window.location.origin,
    });
    if (user) {
      onConfirm({ userId: user._id });
      close();
    }
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
                disableLink
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
                  <IdentityBadge user={user} size="small" disableLink />
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
        {allowInvite && (
          <>
            <Separator text="or" />
            <UserForm id="invite-user-form" onSubmit={handleInviteUser} />
          </>
        )}
      </div>
      <DialogActions>
        <Button variant="secondary" onClick={close}>
          Close
        </Button>
        <Button type="submit" form="invite-user-form">
          Invite
        </Button>
      </DialogActions>
    </ControlledDialog>
  );
};
