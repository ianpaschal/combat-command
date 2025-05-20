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
  loading?: boolean;
  name: string;
  onChange: (value: InputUserValue) => void;
  value: InputUserValue;
}

export const InputUser = forwardRef<HTMLButtonElement, InputUserProps>(({
  className,
  disabled = false,
  excludedUserIds = [],
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
      <UserSelectDialog id={name} onConfirm={onChange} excludeUserIds={excludedUserIds} />
    </>
  );
});

/*
{replacementUser ? (
          <>
            <IdentityBadge user={replacementUser} size="small" />
            <div className={styles.InputUser_Buttons}>
              <Button
                variant="ghost"
                onClick={() => onChange({ userId: '' as UserId })}
                disabled={loading}
              >
                <X />
              </Button>
              <Button
                variant="ghost"
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  openUserSelectDialog({ userId: replacementUser._id });
                }}
                disabled={loading}
              >
                <Pen />
              </Button>
            </div>
          </>
        ) : (
          <Button
            variant="secondary"
            onClick={(e: MouseEvent) => {
              e.preventDefault();
              openUserSelectDialog({ userId, placeholder });
            }}
            disabled={loading}
          >
            Select
          </Button>
        )}
          */
