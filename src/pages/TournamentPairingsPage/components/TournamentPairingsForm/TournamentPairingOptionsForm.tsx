import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Select } from '@ianpaschal/combat-command-components';
import { TournamentPairingMethod } from '@ianpaschal/combat-command-game-systems/common';
import clsx from 'clsx';

import { Tournament, TournamentId } from '~/api';
import { Checkbox } from '~/components/generic/Checkbox';
import { Form, FormField } from '~/components/generic/Form';
import { validateForm } from '~/utils/validateForm';
import {
  createSchema,
  defaultValues,
  FormData,
  SubmitData,
} from './TournamentPairingOptionsForm.schema';

import styles from './TournamentPairingOptionsForm.module.scss';

export interface TournamentPairingOptionsFormProps {
  className?: string;
  disabled?: boolean;
  forcedValues?: Partial<SubmitData> & { tournamentId: TournamentId };
  id?: string;
  loading?: boolean;
  onSubmit: (data: SubmitData) => void;
  setDirty?: (dirty: boolean) => void;
  tournament: Tournament;
}

export const TournamentPairingOptionsForm = ({
  className,
  disabled = false,
  forcedValues,
  id,
  loading = false,
  onSubmit,
  setDirty,
  tournament,
}: TournamentPairingOptionsFormProps): JSX.Element => {
  const schema = createSchema(tournament);
  const form = useForm<FormData>({
    defaultValues: {
      ...defaultValues,
      ...forcedValues,
    },
    mode: 'onSubmit',
  });

  const methodOptions = [
    { value: TournamentPairingMethod.Adjacent, label: 'Adjacent (Swiss)' },
    { value: TournamentPairingMethod.Random, label: 'Random' },
  ];

  // Track form dirty state and notify parent
  useEffect(() => {
    setDirty?.(form.formState.isDirty);
  }, [form.formState.isDirty, setDirty]);

  const handleSubmit: SubmitHandler<FormData> = async (formData): Promise<void> => {
    const validFormData = validateForm(schema, formData, form.setError);
    if (validFormData) {
      onSubmit(validFormData);
    }
  };

  const showLoading = [
    loading,
  ].some((l) => !!l);

  return (
    <Form
      id={id}
      form={form}
      className={clsx(styles.TournamentRegistrationForm, className)}
      onSubmit={handleSubmit}
      disabled={disabled || showLoading}
    >
      <FormField name="method" label="Method">
        <Select options={methodOptions} />
      </FormField>
      <div>
        <FormField name="options.allowRepeat" label="Allow Repeats" description="Players can play opponents they've already faced.">
          <Checkbox />
        </FormField>
        <FormField name="options.allowSameAlignment" label="Allow Same Alignment" description="Allow blue vs. blue and red vs. red match-ups.">
          <Checkbox />
        </FormField>
      </div>
    </Form>
  );
};
