import { forwardRef, MouseEvent } from 'react';
import clsx from 'clsx';

import { UserId } from '~/api';
import { Button } from '~/components/generic/Button';
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
      <Button
        className={clsx(styles.InputUser, className)} ref={ref} id={name} {...props}
        data-error={hasError}
        variant="outlined"
        onClick={(e: MouseEvent) => {
          e.preventDefault();
          openUserSelectDialog();
        }}
        disabled={disabled || loading}
      >
        {replacementUser ? (
          <IdentityBadge user={replacementUser} size="small" disableLink />
        ) : (
          'Select'
        )}
      </Button>
      <UserSelectDialog id={name} value={value} onConfirm={handleChange} excludeUserIds={excludedUserIds} allowPlaceholder={allowPlaceholder} />
    </>
  );
});
