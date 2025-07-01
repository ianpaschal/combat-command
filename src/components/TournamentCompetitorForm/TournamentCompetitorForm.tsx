import { MouseEvent } from 'react';
import { Fragment } from 'react/jsx-runtime';
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
import { Label } from '~/components/generic/Label';
import { Switch } from '~/components/generic/Switch';
import { InputUser } from '~/components/InputUser';
import { useTournament } from '~/components/TournamentProvider';
import { useGetTournamentCompetitorsByTournament } from '~/services/tournamentCompetitors';
import { getEtcCountryOptions } from '~/utils/common/getCountryOptions';
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
  loading?: boolean;
  onSubmit: (data: SubmitData) => void;
  tournamentCompetitor?: TournamentCompetitor;
}

export const TournamentCompetitorForm = ({
  className,
  id,
  loading = false,
  onSubmit,
  tournamentCompetitor,
}: TournamentCompetitorFormProps): JSX.Element => {
  const user = useAuth();
  const {
    _id: tournamentId,
    competitorSize,
    status,
    useTeams,
    useNationalTeams,
    organizerUserIds,
    playerUserIds: existingPlayerUserIds,
  } = useTournament();
  const { data: tournamentCompetitors } = useGetTournamentCompetitorsByTournament({ tournamentId });

  // Get other competitors, we can block repeat names:
  const otherCompetitors = (tournamentCompetitors || []).filter((c) => c._id !== tournamentCompetitor?._id);

  const form = useForm<FormData>({
    resolver: zodResolver(createSchema(competitorSize, status, otherCompetitors)),
    defaultValues: getDefaultValues(competitorSize, tournamentCompetitor),
    mode: 'onSubmit',
  });
  const { fields, append } = useFieldArray({
    control: form.control,
    name: 'players',
    rules: {
      minLength: competitorSize,
    },
  });
  const players = useWatch({
    control: form.control,
    name: 'players',
  });

  const nationalTeamOptions = getEtcCountryOptions().filter(({ value }) => (
    !otherCompetitors.find((c) => c.teamName === value)
  ));

  const handleChangeUser = (i: number, { userId }: { userId?: UserId, placeholder?: string }): void => {
    if (userId !== undefined) {
      form.setValue(`players.${i}.userId`, userId);
    }
  };

  const handleChangePlayerActive = (i: number, active: boolean): void => {
    form.setValue(`players.${i}.active`, active);
  };

  const handleAddPlayer = (e: MouseEvent): void => {
    e.preventDefault();
    append({
      active: players.filter((p) => p.active).length < competitorSize,
      userId: '' as UserId,
    });
  };

  const handleSubmit: SubmitHandler<FormData> = async ({ players, ...formData }): Promise<void> => {
    onSubmit({
      tournamentId,
      players: players.filter((p) => p.userId.length),
      ...formData,
    });
  };

  const excludedUserIds = [
    ...existingPlayerUserIds,
    ...players.map((player) => player.userId),
  ];

  const isOrganizer = user && organizerUserIds.includes(user._id);

  const emptyPlayerSlots = players.filter((player) => !player.userId.length).length;

  return (
    <Form id={id} form={form} onSubmit={handleSubmit} className={clsx(styles.TournamentCompetitorForm, className)}>
      {useTeams && (
        <FormField name="teamName" label={useNationalTeams ? 'Country' : 'Team Name'}>
          {useNationalTeams ? (
            <InputSelect options={nationalTeamOptions} disabled={!isOrganizer} />
          ) : (
            <InputText />
          )}
        </FormField>
      )}
      {useTeams ? (
        <div className={styles.TournamentCompetitorForm_TeamPlayers}>
          <Label>Active</Label>
          <Label>User</Label>
          {fields.map((field, i) => (
            <Fragment key={field.id}>
              <Switch
                name={`players.${i}.active`}
                checked={players[i]?.active ?? false}
                onCheckedChange={(value) => handleChangePlayerActive(i, value)}
                disabled={loading}
              />
              <InputUser
                name={`players.${i}.userId`}
                value={{ userId: players[i]?.userId }}
                onChange={(value) => handleChangeUser(i, value)}
                excludedUserIds={excludedUserIds}
                disabled={loading || (!!players[i]?.userId && status !== 'published')}
                allowPlaceholder={false}
              />
            </Fragment>
          ))}
          <div className={styles.TournamentCompetitorForm_TeamPlayers_AddButton}>
            <Button
              onClick={handleAddPlayer}
              disabled={loading || emptyPlayerSlots > 0}
            >
              <Plus />
              Add Player Slot
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Label>User</Label>
          <InputUser
            name={'players.0.userId'}
            onChange={(value) => handleChangeUser(0, value)}
            value={{ userId: players[0].userId }}
            excludedUserIds={excludedUserIds}
            disabled={loading}
            allowPlaceholder={false}
          />
        </>
      )}
      {
        form.formState.errors['players'] && (
          <span className={styles.TournamentCompetitorForm_PlayerErrors}>
            {form.formState.errors['players'].message}
          </span>
        )
      }
    </Form>
  );
};
