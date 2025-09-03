import { ChangeEvent, useState } from 'react';

import { UserId } from '~/api';
import { Button } from '~/components/generic/Button';
import {
  ControlledDialog,
  DialogActions,
  DialogHeader,
} from '~/components/generic/Dialog';
import { InputText } from '~/components/generic/InputText';
import { Label } from '~/components/generic/Label';
import { Separator } from '~/components/generic/Separator';
import { toast } from '~/components/ToastProvider';
import { UserForm } from '~/components/UserSelectDialog/components/UserForm';
import { UserSubmitData } from '~/components/UserSelectDialog/components/UserForm/UserForm.schema';
import { UserList } from '~/components/UserSelectDialog/components/UserList';
import { useUserSelectDialog } from '~/components/UserSelectDialog/UserSelectDialog.hooks';
import { useInviteUser } from '~/services/users';
import { PATHS } from '~/settings';

import styles from './UserSelectDialog.module.scss';

export type UserSelectDialogValue = { userId?: UserId, placeholder?: string };

export interface UserSelectDialogProps {
  allowInvite?: boolean;
  allowPlaceholder?: boolean;
  excludeUserIds?: UserId[];
  id: string;
  value: UserSelectDialogValue;
  onConfirm: (data: UserSelectDialogValue) => void,
}

export const UserSelectDialog = ({
  allowInvite = false,
  allowPlaceholder = true,
  excludeUserIds = [],
  id: key,
  value,
  onConfirm,
}: UserSelectDialogProps): JSX.Element => {
  const { id, close } = useUserSelectDialog(key);
  const { action: inviteUser } = useInviteUser({
    onSuccess(response) {
      toast.success(`Successfully invited ${response.givenName} ${response.familyName} to CombatCommand!`);
    },
  });

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
      claimUrl: `${window.location.origin}${PATHS.claim}`,
    });
    if (user) {
      onConfirm({ userId: user._id });
      close();
    }
  };

  const handleChange = (userId: UserId | null): void => {
    onConfirm({
      userId: userId ?? '' as UserId,
    });
    setPlaceholder('');
    close();
  };

  return (
    <ControlledDialog id={id} width="small">
      <DialogHeader title="Select User" onCancel={close} />
      <div className={styles.UserSelectDialog}>
        <UserList
          selected={value?.userId}
          onConfirm={handleChange}
          excludeUserIds={excludeUserIds}
        />
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
