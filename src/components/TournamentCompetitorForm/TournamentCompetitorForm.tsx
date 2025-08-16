import { MouseEvent } from 'react';
import {
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { Plus } from 'lucide-react';

import {
  TournamentCompetitor,
  TournamentId,
  UserId,
} from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { Form, FormField } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { InputUser } from '~/components/InputUser';
import { useTournament } from '~/components/TournamentProvider';
import { useGetTournamentCompetitorsByTournament } from '~/services/tournamentCompetitors';
import { useGetTournamentRegistrationsByTournament } from '~/services/tournamentRegistrations';
import { getEtcCountryOptions } from '~/utils/common/getCountryOptions';
import { isUserTournamentOrganizer } from '~/utils/common/isUserTournamentOrganizer';
import {
  createSchema,
  FormData,
  getDefaultValues,
} from './TournamentCompetitorForm.schema';

import styles from './TournamentCompetitorForm.module.scss';

export type SubmitData = FormData & {
  tournamentId: TournamentId;
};

export interface TournamentCompetitorFormProps {
  className?: string;
  id: string;
  disabled?: boolean;
  onSubmit: (data: SubmitData) => void;
  tournamentCompetitor?: TournamentCompetitor;
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
  const { data: tournamentCompetitors, loading: tournamentCompetitorsLoading } = useGetTournamentCompetitorsByTournament({
    tournamentId: tournament._id,
  });
  const { data: tournamentRegistrations, loading: tournamentRegistrationsLoading } = useGetTournamentRegistrationsByTournament({
    tournamentId: tournament._id,
  });

  // Get other competitors, we can block repeat names:
  const otherCompetitors = (tournamentCompetitors || []).filter((c) => c._id !== tournamentCompetitor?._id);

  const form = useForm<FormData>({
    resolver: zodResolver(createSchema(otherCompetitors)),
    defaultValues: getDefaultValues(user?._id, tournamentCompetitor),
    mode: 'onSubmit',
  });
  const { fields, append } = useFieldArray({
    control: form.control,
    name: 'addedPlayers',
    rules: {
      minLength: 1,
    },
  });
  const addedPlayers = useWatch({
    control: form.control,
    name: 'addedPlayers',
  });

  const nationalTeamOptions = getEtcCountryOptions().filter(({ value }) => (
    !otherCompetitors.find((c) => c.teamName === value)
  ));

  const handleChangeUser = (i: number, userId?: UserId): void => {
    if (userId !== undefined) {
      form.setValue(`addedPlayers.${i}.userId`, userId);
    }
  };

  const handleAddPlayer = (e: MouseEvent): void => {
    e.preventDefault();
    append({ userId: undefined });
  };

  const handleSubmit: SubmitHandler<FormData> = async ({ ...formData }): Promise<void> => {
    onSubmit({
      tournamentId: tournament._id,
      ...formData,
    });
  };

  const emptyPlayerSlots = addedPlayers.filter((id) => !id).length;

  const excludedUserIds = [
    ...(tournamentRegistrations ?? []).map((r) => r.userId),
    ...addedPlayers.map(({ userId }) => userId).filter((userId): userId is UserId => !!userId),
  ];

  const isOrganizer = isUserTournamentOrganizer(user, tournament);

  const loading = tournamentCompetitorsLoading || tournamentRegistrationsLoading;

  return (
    <Form
      id={id}
      form={form}
      className={clsx(styles.TournamentCompetitorForm, className)}
      onSubmit={handleSubmit}
      disabled={disabled}
    >
      <FormField name="teamName" label={tournament.useNationalTeams ? 'Country' : 'Team Name'}>
        {tournament.useNationalTeams ? (
          <InputSelect options={nationalTeamOptions} />
        ) : (
          <InputText />
        )}
      </FormField>
      {fields.map((field, i) => (
        <InputUser
          key={field.id}
          name={`playerUserIds.${i}`}
          value={addedPlayers[i]}
          onChange={(value) => handleChangeUser(i, value.userId)}
          excludedUserIds={excludedUserIds}
          disabled={disabled || loading || !isOrganizer}
          allowPlaceholder={false}
        />
      ))}
      {isOrganizer && (
        <div>
          <Button
            onClick={handleAddPlayer}
            disabled={loading || emptyPlayerSlots > 0}
          >
            <Plus />
            Add Player Slot
          </Button>
        </div>
      )}
    </Form>
  );
};
