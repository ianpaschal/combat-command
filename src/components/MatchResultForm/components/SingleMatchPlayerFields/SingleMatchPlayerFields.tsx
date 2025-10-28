import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { useAuth } from '~/components/AuthProvider';
import { SelectPlayerDialog } from '../SelectPlayerDialog';

import styles from './SingleMatchPlayerFields.module.scss';

export const SingleMatchPlayerFields = (): JSX.Element => {
  const user = useAuth();
  const { setValue, watch, reset } = useFormContext();
  const [editingPlayer, setEditingPlayer] = useState<null | 0 | 1>(null);

  const values = watch();

  useEffect(() => {
    if (user?._id === values.player0UserId) {
      setEditingPlayer(0);
    }
    if (user?._id === values.player1UserId) {
      setEditingPlayer(1);
    }
    if (user?._id && !values.player0UserId && !values.player1UserId) {
      setEditingPlayer(0);
      setValue('player0UserId', user._id);
    }
  }, [user, values, setValue]);

  const handleConfirmPlayer = (playerIndex: 0 | 1, { userId, placeholder }: { userId?: string, placeholder?: string }): void => {
    if (userId) {
      return reset((prev) => ({
        ...prev,
        [`player${playerIndex}UserId`]: userId,
        [`player${playerIndex}Placeholder`]: '',
      }));
    }
    if (placeholder) {
      return reset((prev) => ({
        ...prev,
        [`player${playerIndex}UserId`]: '',
        [`player${playerIndex}Placeholder`]: placeholder,
      }));
    }
  };

  return (
    <>
      <div className={styles.Root}>
        {([0, 1] as const).map((i) => (
          <div key={i} className={styles[`Player${i}Section`]}>
            <SelectPlayerDialog
              userId={values[`player${i}UserId`]}
              placeholder={values[`player${i}Placeholder`]}
              onConfirm={(data) => handleConfirmPlayer(i, data)}
              disabled={editingPlayer === i}
            />
          </div>
        ))}
      </div>
    </>
  );
};
