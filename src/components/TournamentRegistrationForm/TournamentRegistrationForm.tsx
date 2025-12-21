import { MouseEvent, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@ianpaschal/combat-command-components';
import clsx from 'clsx';
import { Trash } from 'lucide-react';

import { TournamentId } from '~/api';
import { Form, FormField } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { Separator } from '~/components/generic/Separator';
import { InputUser } from '~/components/InputUser';
import { useGetTournamentCompetitorsByTournament } from '~/services/tournamentCompetitors';
import { useGetTournamentRegistrationsByTournament } from '~/services/tournamentRegistrations';
import { useGetTournament } from '~/services/tournaments';
import { getEtcCountryOptions } from '~/utils/common/getCountryOptions';
import { validateForm } from '~/utils/validateForm';
import {
  createSchema,
  defaultValues,
  FormData,
  SubmitData,
} from './TournamentRegistrationForm.schema';

import styles from './TournamentRegistrationForm.module.scss';

export interface TournamentRegistrationFormProps {
  className?: string;
  disabled?: boolean;
  existingValues?: Partial<SubmitData>;
  forcedValues?: Partial<SubmitData> & { tournamentId: TournamentId };
  id?: string;
  loading?: boolean;
  onSubmit: (data: SubmitData) => void;
  setDirty?: (dirty: boolean) => void;
}

export const TournamentRegistrationForm = ({
  className,
  disabled = false,
  existingValues,
  forcedValues,
  id,
  loading = false,
  onSubmit,
  setDirty,
}: TournamentRegistrationFormProps): JSX.Element => {
  const schema = createSchema();
  const form = useForm<FormData>({
    defaultValues: {
      ...defaultValues,
      ...existingValues,
      ...forcedValues,
    },
    mode: 'onSubmit',
  });

  const tournamentId = form.watch('tournamentId') as TournamentId | undefined;

  const {
    data: existingTournament,
    loading: existingTournamentLoading,
  } = useGetTournament(tournamentId ? {
    id: tournamentId,
  } : 'skip');
  const {
    data: existingCompetitors,
    loading: existingCompetitorsLoading,
  } = useGetTournamentCompetitorsByTournament(tournamentId ? {
    tournamentId,
  } : 'skip');
  const {
    data: existingRegistrations,
    loading: existingRegistrationsLoading,
  } = useGetTournamentRegistrationsByTournament(tournamentId ? {
    tournamentId,
  } : 'skip');
  const existingCompetitorTeamNames = new Set<string>();
  const existingCompetitorOptions = (existingCompetitors ?? []).map((r) => {
    if (r.teamName) {
      existingCompetitorTeamNames.add(r.teamName);
    }
    return {
      value: r._id,
      label: r.displayName,
    };
  });
  const availableCompetitorOptions = getEtcCountryOptions().filter((option) => (
    !existingCompetitorTeamNames.has(option.value)
  ));
  const excludedUserIds = (existingRegistrations ?? []).map((r) => r.userId);

  // Track form dirty state and notify parent
  useEffect(() => {
    setDirty?.(form.formState.isDirty);
  }, [form.formState.isDirty, setDirty]);

  const handleClearTournamentCompetitorId = (e: MouseEvent): void => {
    e.preventDefault();
    form.setValue('tournamentCompetitorId', null);
  };

  const handleClearTeamName = (e: MouseEvent): void => {
    e.preventDefault();
    form.setValue('tournamentCompetitor.teamName', '');
  };

  const handleSubmit: SubmitHandler<FormData> = async (formData): Promise<void> => {
    const validFormData = validateForm(schema, {
      ...formData,
      ...forcedValues,
    }, form.setError);
    if (validFormData) {
      onSubmit(validFormData);
    }
  };

  const showLoading = [
    loading,
    existingTournamentLoading,
    existingCompetitorsLoading,
    existingRegistrationsLoading,
  ].some((l) => !!l);

  const showUserInput = !forcedValues?.userId;
  const showTeamNameInput = !forcedValues?.tournamentCompetitorId && existingTournament?.useTeams;

  return (
    <Form
      id={id}
      form={form}
      className={clsx(styles.TournamentRegistrationForm, className)}
      onSubmit={handleSubmit}
      disabled={disabled || showLoading}
    >
      {showUserInput && (
        <FormField name="userId" label="User">
          <InputUser excludeIds={excludedUserIds} />
        </FormField>
      )}
      {showTeamNameInput && (
        <div>
          <FormField name="tournamentCompetitorId" label="Team">
            <InputSelect options={existingCompetitorOptions} />
          </FormField>
          <Button
            icon={<Trash />}
            variant="outlined"
            onClick={handleClearTournamentCompetitorId}
            disabled={form.watch('tournamentCompetitorId') === null}
          />
          <Separator text="or" />
          <FormField name="tournamentCompetitor.teamName" label="Create New Team">
            {existingTournament.useNationalTeams ? (
              <InputSelect options={availableCompetitorOptions} />
            ) : (
              <InputText />
            )}
          </FormField>
          <Button
            icon={<Trash />}
            variant="outlined"
            onClick={handleClearTeamName}
            disabled={form.watch('tournamentCompetitor.teamName') === ''}
          />
        </div>
      )}
    </Form>
  );
};
