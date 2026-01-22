import { MouseEvent, useEffect } from 'react';
import {
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import clsx from 'clsx';
import { Plus } from 'lucide-react';

import { Tournament, TournamentCompetitor } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { Form, FormField } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { InputUser, InputUserProps } from '~/components/InputUser';
import { ScoreAdjustmentFormItem } from '~/components/TournamentCompetitorForm/components/ScoreAdjustmentFormItem';
import { useGetTournamentCompetitorsByTournament } from '~/services/tournamentCompetitors';
import { useGetTournamentRegistrationsByTournament } from '~/services/tournamentRegistrations';
import { getEtcCountryOptions } from '~/utils/common/getCountryOptions';
import { isUserTournamentOrganizer } from '~/utils/common/isUserTournamentOrganizer';
import { validateForm } from '~/utils/validateForm';
import {
  createSchema,
  defaultValues,
  FormData,
  SubmitData,
} from './TournamentCompetitorForm.schema';

import styles from './TournamentCompetitorForm.module.scss';

export interface TournamentCompetitorFormProps {
  className?: string;
  disabled?: boolean;
  forcedValues?: Partial<SubmitData>;
  id?: string;
  loading?: boolean;
  onSubmit: (data: SubmitData) => void;
  setDirty?: (dirty: boolean) => void;
  tournament: Tournament;
  tournamentCompetitor?: TournamentCompetitor | null;
}

export const TournamentCompetitorForm = ({
  className,
  disabled = false,
  forcedValues,
  id,
  // loading = false,
  onSubmit,
  setDirty,
  tournament,
  tournamentCompetitor,
}: TournamentCompetitorFormProps): JSX.Element => {

  const user = useAuth();
  const {
    data: tournamentCompetitors,
    // loading: tournamentCompetitorsLoading,
  } = useGetTournamentCompetitorsByTournament({
    tournamentId: tournament._id,
  });
  const {
    data: tournamentRegistrations,
    // loading: tournamentRegistrationsLoading,
  } = useGetTournamentRegistrationsByTournament({
    tournamentId: tournament._id,
  });

  const userSelectProps: Partial<InputUserProps> = tournamentCompetitor ? {
    options: (tournamentRegistrations ?? []).filter((r) => (
      r.tournamentCompetitorId === tournamentCompetitor?._id
    )).map((r) => r.user),
  } : {
    excludeIds: (tournamentRegistrations ?? []).map((r) => r.userId),
  };

  const otherCompetitors = (tournamentCompetitors || []).filter((c) => (
    c._id !== tournamentCompetitor?._id
  ));

  const schema = createSchema(tournament.useTeams, otherCompetitors);
  const form = useForm<FormData>({
    defaultValues: {
      ...defaultValues,
      ...tournamentCompetitor,
      ...forcedValues,
    },
    mode: 'onSubmit',
  });

  const { formState: { isDirty } } = form;
  useEffect(() => {
    setDirty?.(isDirty);
    return () => setDirty?.(false);
  }, [isDirty, setDirty]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'scoreAdjustments',
  });

  const nationalTeamOptions = getEtcCountryOptions().filter(
    ({ value }) => !otherCompetitors.find((c) => c.teamName === value),
  );

  const handleAddScoreAdjustment = (e: MouseEvent): void => {
    e.preventDefault();
    append({
      amount: 1,
      round: tournament.currentRound ?? 0,
      rankingFactor: [...tournament.rankingFactors].pop()!,
      reason: '',
    });
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

  // const showLoading = loading || tournamentCompetitorsLoading || tournamentRegistrationsLoading;

  const isOrganizer = isUserTournamentOrganizer(user, tournament);

  return (
    <Form
      id={id}
      form={form}
      className={clsx(styles.TournamentCompetitorForm, className)}
      onSubmit={handleSubmit}
      disabled={disabled}
    >
      {tournament.useTeams && (
        <>
          <FormField name="teamName" label={tournament.useNationalTeams ? 'Country' : 'Team Name'}>
            {tournament.useNationalTeams ? (
              <InputSelect options={nationalTeamOptions} />
            ) : (
              <InputText />
            )}
          </FormField>
          <FormField name="captainUserId" label={tournament.useTeams ? 'Captain' : 'Player'}>
            <InputUser {...userSelectProps} />
          </FormField>
        </>
      )}

      {isOrganizer && (
        <>
          <div className={styles.TournamentCompetitorForm_ScoreAdjustmentHeader}>
            <h3>Bonuses & Penalties</h3>
            <Button
              disabled={disabled}
              icon={<Plus />}
              size="small"
              text="Add"
              variant="secondary"
              onClick={handleAddScoreAdjustment}
            />
          </div>
          {fields.map((field, index) => (
            <ScoreAdjustmentFormItem
              index={index}
              key={field.id}
              onRemove={remove}
              tournament={tournament}
            />
          ))}
        </>
      )}
    </Form>
  );
};
