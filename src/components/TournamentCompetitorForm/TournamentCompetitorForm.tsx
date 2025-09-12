import { MouseEvent } from 'react';
import {
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import clsx from 'clsx';
import { Plus } from 'lucide-react';

import { TournamentCompetitor, TournamentId } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { Form, FormField } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { Separator } from '~/components/generic/Separator';
import { InputUser } from '~/components/InputUser';
import { ScoreAdjustmentFormItem } from '~/components/TournamentCompetitorForm/components/ScoreAdjustmentFormItem';
import { useTournament } from '~/components/TournamentProvider';
import { useGetTournamentCompetitorsByTournament } from '~/services/tournamentCompetitors';
import { useGetTournamentRegistrationsByTournament } from '~/services/tournamentRegistrations';
import { getEtcCountryOptions } from '~/utils/common/getCountryOptions';
import { isUserTournamentOrganizer } from '~/utils/common/isUserTournamentOrganizer';
import { validateForm } from '~/utils/validateForm';
import {
  createSchema,
  getDefaultValues,
  TournamentCompetitorFormData,
  TournamentCompetitorSubmitData,
} from './TournamentCompetitorForm.schema';

import styles from './TournamentCompetitorForm.module.scss';

export type SubmitData = TournamentCompetitorSubmitData & {
  tournamentId: TournamentId;
};

export interface TournamentCompetitorFormProps {
  className?: string;
  id: string;
  disabled?: boolean;
  onSubmit: (data: SubmitData) => void;
  tournamentCompetitor?: TournamentCompetitor | null;
}

export const TournamentCompetitorForm = ({
  className,
  id,
  disabled = false,
  onSubmit,
  tournamentCompetitor,
}: TournamentCompetitorFormProps): JSX.Element => {
  const user = useAuth();
  const tournament = useTournament();
  const { data: tournamentCompetitors, loading: tournamentCompetitorsLoading } =
    useGetTournamentCompetitorsByTournament({
      tournamentId: tournament._id,
    });
  const { data: tournamentRegistrations, loading: tournamentRegistrationsLoading } =
    useGetTournamentRegistrationsByTournament({
      tournamentId: tournament._id,
    });

  const isOrganizer = isUserTournamentOrganizer(user, tournament);

  const otherCompetitors = (tournamentCompetitors || []).filter((c) => (
    c._id !== tournamentCompetitor?._id
  ));

  const formSchema = createSchema(
    !tournamentCompetitor ? 'create' : 'update',
    tournament.useTeams,
    otherCompetitors,
  );
  const form = useForm<TournamentCompetitorFormData>({
    defaultValues: {
      ...getDefaultValues(!isOrganizer ? user?._id : undefined),
      ...tournamentCompetitor,
    },
    mode: 'onSubmit',
  });

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

  const handleSubmit: SubmitHandler<TournamentCompetitorFormData> = async ({
    ...formData
  }): Promise<void> => {
    const data = validateForm(formSchema, formData, form.setError);
    if (data) {
      onSubmit({
        tournamentId: tournament._id,
        ...data,
      });
    }
  };

  const excludedUserIds = (tournamentRegistrations ?? []).map((r) => r.userId);

  const loading = tournamentCompetitorsLoading || tournamentRegistrationsLoading;

  return (
    <Form
      id={id}
      form={form}
      className={clsx(styles.TournamentCompetitorForm, className)}
      onSubmit={handleSubmit}
      disabled={disabled}
    >
      {tournament.useTeams && (
        <FormField
          name="teamName"
          label={tournament.useNationalTeams ? 'Country' : 'Team Name'}
        >
          {tournament.useNationalTeams ? (
            <InputSelect options={nationalTeamOptions} />
          ) : (
            <InputText />
          )}
        </FormField>
      )}
      {!tournamentCompetitor && (
        <FormField name="captain" label={tournament.useTeams ? 'Captain' : 'Player'}>
          <InputUser
            excludedUserIds={excludedUserIds}
            disabled={disabled || loading || !isOrganizer}
            allowPlaceholder={false}
            allowInvite
          />
        </FormField>
      )}
      <Separator />
      <div className={styles.TournamentCompetitorForm_ScoreAdjustmentHeader}>
        <h3>Bonuses & Penalties</h3>
        <Button
          variant="secondary"
          onClick={handleAddScoreAdjustment}
          disabled={disabled}
          size="small"
        >
          <Plus />Add
        </Button>
      </div>
      {fields.map((field, index) => (
        <ScoreAdjustmentFormItem key={field.id} index={index} onRemove={remove} />
      ))}
    </Form>
  );
};
