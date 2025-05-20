import {
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';

import {
  TournamentCompetitorId,
  TournamentId,
  UserId,
} from '~/api';
import { Form, FormField } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { Label } from '~/components/generic/Label';
import { Switch } from '~/components/generic/Switch';
import { InputUser } from '~/components/InputUser';
import { useTournament } from '~/components/TournamentProvider';
import { useGetTournamentCompetitorsByTournamentId } from '~/services/tournamentCompetitors';
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
  tournamentCompetitorId?: TournamentCompetitorId;
}

export const TournamentCompetitorForm = ({
  className,
  id,
  loading = false,
  onSubmit,
  tournamentCompetitorId,
}: TournamentCompetitorFormProps): JSX.Element => {
  const {
    _id: tournamentId,
    competitorSize,
    useTeams,
    useNationalTeams,
    playerUserIds,
  } = useTournament();
  const { data: tournamentCompetitors } = useGetTournamentCompetitorsByTournamentId(tournamentId);
  const existingCompetitor = (tournamentCompetitors || []).find((c) => c._id === tournamentCompetitorId);

  const form = useForm<FormData>({
    resolver: zodResolver(createSchema(competitorSize, tournamentCompetitors)),
    defaultValues: {
      ...getDefaultValues(competitorSize),
      ...(existingCompetitor ?? {}),
    },
    mode: 'onSubmit',
  });
  const { fields } = useFieldArray({
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

  const handleChangeUser = (i: number, { userId }: { userId?: UserId, placeholder?: string }): void => {
    if (userId) {
      form.setValue(`players.${i}.userId`, userId);
    }
  };
  const handleChangePlayerActive = (i: number, active: boolean): void => {
    form.setValue(`players.${i}.active`, active);
  };
  const handleSubmit: SubmitHandler<FormData> = async (formData) => {
    onSubmit({ tournamentId, ...formData });
  };

  return (
    <Form id={id} form={form} onSubmit={handleSubmit} className={clsx(styles.TournamentCompetitorForm, className)}>
      {useTeams && (
        <FormField name="teamName" label="Team Name">
          {useNationalTeams ? (
            <InputSelect options={[]} />
          ) : (
            <InputText />
          )}
        </FormField>
      )}
      {useTeams ? (
        <div className={styles.TournamentCompetitorForm_TeamPlayers}>
          <Label>Active</Label>
          <Label>User</Label>
          {fields.map((_, i) => (
            <>
              <Switch
                key={`input-active-${i}`}
                name={`players.${i}.active`}
                checked={players[i].active}
                onCheckedChange={(value) => handleChangePlayerActive(i, value)}
                disabled={loading}
              />
              <InputUser
                key={`input-user-${i}`}
                name={`players.${i}.userId`}
                value={{ userId: players[i].userId }}
                onChange={(value) => handleChangeUser(i, value)}
                excludedUserIds={playerUserIds}
                disabled={loading}
              />
            </>
          ))}
        </div>
      ) : (
        <>
          <Label>User</Label>
          <InputUser
            name={'players.0.userId'}
            onChange={(value) => handleChangeUser(0, value)}
            value={{ userId: players[0].userId }}
            excludedUserIds={playerUserIds}
            disabled={loading}
          />
        </>
      )}
      {form.formState.errors['players'] && (
        <span className={styles.TournamentCompetitorForm_PlayerErrors}>
          {form.formState.errors['players'].message}
        </span>
      )}
    </Form>
  );
};
