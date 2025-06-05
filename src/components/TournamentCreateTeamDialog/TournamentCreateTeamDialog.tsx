import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '~/components/generic/Button';
import {
  ControlledDialog,
  DialogActions,
  DialogHeader,
} from '~/components/generic/Dialog';
import { Form, FormField } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { useTournament } from '~/components/TournamentProvider';
import { useCreateTournamentCompetitor } from '~/services/tournamentCompetitors/useCreateTournamentCompetitor';
import { getEtcCountryOptions } from '~/utils/common/getCountryOptions';
import { useTournamentCreateTeamDialog } from './TournamentCreateTeamDialog.hooks';
import {
  defaultValues,
  TournamentCreateTeamFormData,
  tournamentCreateTeamFormSchema,
} from './TournamentCreateTeamDialog.schema';

import styles from './TournamentCreateTeamDialog.module.scss';

export const TournamentCreateTeamDialog = (): JSX.Element => {
  const tournament = useTournament();
  const { id, close } = useTournamentCreateTeamDialog(tournament._id);

  const form = useForm<TournamentCreateTeamFormData>({
    resolver: zodResolver(tournamentCreateTeamFormSchema),
    defaultValues,
    mode: 'onChange',
  });
  const { mutation: createTournamentCompetitor, loading } = useCreateTournamentCompetitor({ onSuccess: close });
  const onSubmit: SubmitHandler<TournamentCreateTeamFormData> = ({ teamName }) => {
    createTournamentCompetitor({
      tournamentId: tournament._id,
      teamName,
      players: [],
    });
  };
  return (
    <ControlledDialog id={id} onCloseComplete={form.reset} width="small">
      <DialogHeader title="Create New Team" onCancel={close} />
      <Form className={styles.Form} onSubmit={onSubmit} id="tournament-create-team-form" form={form}>
        <FormField name="teamName" label="Team Name">
          {tournament.useNationalTeams ? (
            <InputSelect name="teamName" options={getEtcCountryOptions()} />
          ) : (
            <InputText name="teamName" />
          )}
        </FormField>
        {/* TODO: Add competitor group select */}
      </Form>
      <DialogActions>
        <Button variant="secondary" onClick={close} disabled={loading}>Cancel</Button>
        <Button type="submit" form="tournament-create-team-form" loading={loading}>Save</Button>
      </DialogActions>
    </ControlledDialog>
  );
};
