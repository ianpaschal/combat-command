import { forwardRef, MouseEvent } from 'react';
import clsx from 'clsx';

import { UserId } from '~/api';
import { Button } from '~/components/generic/Button';
import { IdentityBadge } from '~/components/IdentityBadge';
import { UserSelectDialog } from '~/components/UserSelectDialog';
import { useUserSelectDialog } from '~/components/UserSelectDialog/UserSelectDialog.hooks';
import { useFetchUser } from '~/services/users/useFetchUser';

import styles from './InputUser.module.scss';

export type InputUserValue = {
  userId?: UserId;
  placeholder?: string;
};

export interface InputUserProps {
  className?: string;
  disabled?: boolean;
  excludedUserIds?: UserId[];
  allowPlaceholder?: boolean;
  loading?: boolean;
  name: string;
  onChange: (value: InputUserValue) => void;
  value: InputUserValue;
}

export const InputUser = forwardRef<HTMLButtonElement, InputUserProps>(({
  className,
  disabled = false,
  excludedUserIds = [],
  allowPlaceholder = true,
  loading = false,
  name,
  onChange,
  value,
  ...props
}, ref): JSX.Element => {
  const { open: openUserSelectDialog } = useUserSelectDialog(name);
  const { userId, placeholder } = value;
  const { data: replacementUser } = useFetchUser(userId);
  return (
    <>
      <Button
        className={clsx(styles.InputUser, className)} ref={ref} id={name} {...props}
        variant="outlined"
        onClick={(e: MouseEvent) => {
          e.preventDefault();
          openUserSelectDialog({ userId, placeholder });
        }}
        disabled={disabled || loading}
      >
        {replacementUser ? (
          <IdentityBadge user={replacementUser} size="small" />
        ) : (
          'Select'
        )}
      </Button>
      <UserSelectDialog id={name} onConfirm={onChange} excludeUserIds={excludedUserIds} allowPlaceholder={allowPlaceholder} />
    </>
  );
});
