import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';

import { TournamentCompetitor, UserId } from '~/api';
import { Form, FormField } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { Label } from '~/components/generic/Label';
import { InputUser } from '~/components/InputUser';
import { useTournament } from '~/components/TournamentProvider';
import { getUserDisplayNameString } from '~/utils/common/getUserDisplayNameString';
import {
  defaultValues,
  SubstitutePlayerFormData,
  substitutePlayerFormSchema,
} from './SubstitutePlayerForm.schema';

import styles from './SubstitutePlayerForm.module.scss';

export interface SubstitutePlayerFormProps {
  id: string;
  className?: string;
  competitor?: TournamentCompetitor;
  loading?: boolean;
  onSubmit: (data: SubstitutePlayerFormData) => void;
}

export const SubstitutePlayerForm = ({
  id,
  className,
  competitor,
  loading = false,
  onSubmit,
}: SubstitutePlayerFormProps): JSX.Element => {
  const tournament = useTournament();

  const form = useForm<SubstitutePlayerFormData>({
    resolver: zodResolver(substitutePlayerFormSchema),
    defaultValues,
    mode: 'onSubmit',
  });
  const { activeUserId, inactiveUserId } = form.watch();

  const activePlayers = (competitor?.players || []).filter((player) => !!player && player.active);

  useEffect(() => {
    const updatedInactiveUserId = activePlayers[0]?.user._id ?? '';
    if (updatedInactiveUserId !== inactiveUserId) {
      form.reset({
        inactiveUserId: updatedInactiveUserId,
      });
    }
  }, [activePlayers, form, inactiveUserId]);

  const handleChangeActiveUserId = ({ userId }: { userId?: UserId }): void => {
    form.setValue('activeUserId', userId ?? '' as UserId);
  };
  const handleSubmit: SubmitHandler<SubstitutePlayerFormData> = (formData): void => {
    onSubmit({
      ...formData,
    });
  };
  const playerOptions = activePlayers.map((player) => ({
    value: player.user._id,
    label: getUserDisplayNameString(player.user),
  }));
  const excludedUserIds = [
    ...tournament.organizerUserIds,
    ...tournament.activePlayerUserIds,
  ];

  return (
    <Form
      id={id}
      className={clsx(styles.SubstitutePlayerForm, className)}
      form={form}
      onSubmit={handleSubmit}
    >
      <FormField name="inactiveUserId" label="User to Replace">
        <InputSelect options={playerOptions} disabled={loading} placeholder="Select" />
      </FormField>
      <div className={styles.SubstitutePlayerForm_ReplacementPlayerField}>
        <Label>Replacement Player</Label>
        <InputUser onChange={handleChangeActiveUserId} value={{ userId: activeUserId }} name="activeUserId" excludedUserIds={excludedUserIds} />
      </div>
    </Form>
  );
};
