import { forwardRef, MouseEvent } from 'react';
import clsx from 'clsx';

import { UserId } from '~/api';
import { IdentityBadge } from '~/components/IdentityBadge';
import { UserSelectDialog } from '~/components/UserSelectDialog';
import { useUserSelectDialog } from '~/components/UserSelectDialog/UserSelectDialog.hooks';
import { useGetUser } from '~/services/users';

import styles from './InputUser.module.scss';

export type InputUserValue = {
  userId?: UserId;
  placeholder?: string;
};

export interface InputUserProps {
  allowInvite?: boolean;
  allowPlaceholder?: boolean;
  className?: string;
  disabled?: boolean;
  excludedUserIds?: UserId[];
  hasError?: boolean;
  loading?: boolean;
  name?: string;
  onChange?: (value: InputUserValue) => void;
  value?: InputUserValue;
}

export const InputUser = forwardRef<HTMLButtonElement, InputUserProps>(({
  allowInvite = false,
  allowPlaceholder = true,
  className,
  disabled = false,
  excludedUserIds = [],
  hasError,
  loading = false,
  name = 'unknown',
  onChange,
  value = {},
  ...props
}, ref): JSX.Element => {
  const { open: openUserSelectDialog } = useUserSelectDialog(name);
  const { data: replacementUser } = useGetUser(value?.userId ? { id: value.userId } : 'skip');
  const handleChange = (v: InputUserValue): void => {
    if (onChange) {
      onChange(v);
    }
  };
  return (
    <>
      <button
        ref={ref}
        className={clsx(styles.InputUser, className)}
        id={name}
        {...props}
        data-error={hasError}
        disabled={disabled || loading}
        onClick={(e: MouseEvent) => {
          e.preventDefault();
          openUserSelectDialog();
        }}
      >
        {replacementUser ? (
          <IdentityBadge user={replacementUser} size="small" disableLink />
        ) : (
          'Select'
        )}
      </button>
      <UserSelectDialog
        id={name}
        value={value}
        onConfirm={handleChange}
        excludeUserIds={excludedUserIds}
        allowPlaceholder={allowPlaceholder}
        allowInvite={allowInvite}
      />
    </>
  );
});
