import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { InputText, Select } from '@ianpaschal/combat-command-components';
import clsx from 'clsx';

import { Tournament, TournamentId } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { Checkbox } from '~/components/generic/Checkbox';
import { Form, FormField } from '~/components/generic/Form';
import { Separator } from '~/components/generic/Separator';
import { InputUser } from '~/components/InputUser';
import { useGetTournamentCompetitorsByTournament } from '~/services/tournamentCompetitors';
import { useGetTournamentRegistrationsByTournament } from '~/services/tournamentRegistrations';
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
  tournament: Tournament;
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
  tournament,
}: TournamentRegistrationFormProps): JSX.Element => {
  const currentUser = useAuth();
  const schema = createSchema(tournament, currentUser);
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

  const handleSubmit: SubmitHandler<FormData> = async (formData): Promise<void> => {
    const validFormData = validateForm(schema, formData, form.setError);
    if (validFormData) {
      onSubmit(validFormData);
    }
  };

  const showLoading = [
    loading,
    existingCompetitorsLoading,
    existingRegistrationsLoading,
  ].some((l) => !!l);

  const showUserField = !forcedValues?.userId;
  const showTeamNameField = !forcedValues?.tournamentCompetitorId && tournament.useTeams;

  const showNameVisibilityConsentInput = tournament?.requireRealNames && currentUser && currentUser._id === form.watch('userId');

  return (
    <Form
      id={id}
      form={form}
      className={clsx(styles.TournamentRegistrationForm, className)}
      onSubmit={handleSubmit}
      disabled={disabled || showLoading}
    >
      {showUserField && (
        <FormField name="userId" label="User">
          <InputUser excludeIds={excludedUserIds} />
        </FormField>
      )}
      {showTeamNameField && (
        <div className={styles.TournamentRegistrationForm_TeamNameSection}>
          <FormField name="tournamentCompetitorId" label="Team">
            <Select options={existingCompetitorOptions} clearable />
          </FormField>
          <Separator text="or" />
          <FormField name="tournamentCompetitor.teamName" label="Create New Team">
            {tournament.useNationalTeams ? (
              <Select options={availableCompetitorOptions} clearable />
            ) : (
              <InputText />
            )}
          </FormField>
        </div>
      )}
      {showNameVisibilityConsentInput && (
        <FormField name="nameVisibilityConsent" label="Allow TO and fellow players to see name.">
          <Checkbox />
        </FormField>
      )}
    </Form>
  );
};
