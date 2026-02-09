import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  TournamentPairingConfig,
  tournamentPairingConfig,
  tournamentPairingConfigSchema,
} from '@ianpaschal/combat-command-game-systems/common';

import { Form } from '~/components/generic/Form';
import { validateForm } from '~/utils/validateForm';
import { TournamentPairingConfigFields } from './TournamentPairingConfigFields';

export interface TournamentPairingConfigFormProps {
  className?: string;
  disabled?: boolean;
  forcedValues?: Partial<TournamentPairingConfig>;
  existingValues?: Partial<TournamentPairingConfig>;
  id?: string;
  loading?: boolean;
  onSubmit?: (data: TournamentPairingConfig) => void;
  setDirty?: (dirty: boolean) => void;
}

export const TournamentPairingConfigForm = ({
  className,
  disabled = false,
  forcedValues,
  existingValues,
  id,
  loading = false,
  onSubmit,
  setDirty,
}: TournamentPairingConfigFormProps): JSX.Element => {
  const form = useForm<TournamentPairingConfig>({
    defaultValues: {
      ...tournamentPairingConfig.defaultValues,
      ...existingValues,
      ...forcedValues,
    },
    mode: 'onSubmit',
  });

  // Track form dirty state and notify parent:
  useEffect(() => {
    setDirty?.(form.formState.isDirty);
  }, [form.formState.isDirty, setDirty]);

  const handleSubmit: SubmitHandler<TournamentPairingConfig> = async (formData): Promise<void> => {
    const validFormData = validateForm(tournamentPairingConfigSchema, formData, form.setError);
    if (validFormData) {
      onSubmit?.(validFormData);
    }
  };

  const showLoading = [
    loading,
  ].some((l) => !!l);

  return (
    <Form
      id={id}
      form={form}
      className={className}
      onSubmit={handleSubmit}
      disabled={disabled || showLoading}
    >
      <TournamentPairingConfigFields path="" loading={loading} />
    </Form>
  );
};
