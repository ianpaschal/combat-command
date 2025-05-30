import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { fowV4BattlePlanOptions, fowV4FactionOptions } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { FormField } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { Separator } from '~/components/generic/Separator';

import { SelectPlayerDialog } from './SelectPlayerDialog';

import styles from './SingleMatchPlayersFields.module.scss';

export const SingleMatchPlayersFields = (): JSX.Element => {
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
            <FormField name={`details.player${i}FactionId`} label="Faction">
              <InputSelect options={fowV4FactionOptions} />
            </FormField>
            <FormField name={`details.player${i}BattlePlan`} label="Battle Plan">
              <InputSelect options={fowV4BattlePlanOptions} />
            </FormField>
            <FormField name={`details.player${i}UnitsLost`} label="Units Lost">
              <InputText type="number" />
            </FormField>
          </div>
        ))}
        <Separator className={styles.Separator} orientation="vertical" />
      </div>
    </>
  );
};
