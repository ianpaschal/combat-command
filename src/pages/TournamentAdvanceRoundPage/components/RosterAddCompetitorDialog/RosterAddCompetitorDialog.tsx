import { Button } from '~/components/generic/Button';
import {
  ControlledDialog,
  DialogActions,
  DialogDescription,
  DialogHeader,
} from '~/components/generic/Dialog';
import { TournamentCompetitorForm } from '~/components/TournamentCompetitorForm';
import { useTournament } from '~/components/TournamentProvider';
import { useCreateTournamentCompetitor } from '~/services/tournamentCompetitors';
import { useRosterAddCompetitorDialog } from './RosterAddCompetitorDialog.hooks';

import styles from './RosterAddCompetitorDialog.module.scss';

const FORM_ID = 'add-tournament-competitor-form';

export const RosterAddCompetitorDialog = (): JSX.Element => {
  const { useTeams } = useTournament();
  const { id, close } = useRosterAddCompetitorDialog();
  const { mutation: createTournamentCompetitor, loading } = useCreateTournamentCompetitor({
    onSuccess: close,
  });
  return (
    <ControlledDialog id={id} className={styles.RosterAddCompetitorDialog} disabled={loading} width="small">
      <DialogHeader title={`Add ${useTeams ? 'Team' : 'Player'}`} onCancel={close} />
      <DialogDescription>
        {`It's possible to add another ${useTeams ? 'team' : 'player'} to the tournament in order to reduce the number of byes.`}
      </DialogDescription>
      <TournamentCompetitorForm
        id={FORM_ID}
        className={styles.RosterAddCompetitorDialog_Form}
        onSubmit={createTournamentCompetitor}
        loading={loading}
      />
      <DialogActions>
        <Button variant="secondary" onClick={close} disabled={loading}>Cancel</Button>
        <Button type="submit" form={FORM_ID}>Submit</Button>
      </DialogActions>
    </ControlledDialog>
  );
};
