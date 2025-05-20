import { Button } from '~/components/generic/Button';
import {
  ControlledDialog,
  DialogActions,
  DialogDescription,
  DialogHeader,
} from '~/components/generic/Dialog';
import { useTournament } from '~/components/TournamentProvider';
import { useRosterConfirmDialog } from './RosterConfirmDialog.hooks';

import styles from './RosterConfirmDialog.module.scss';

export interface RosterConfirmDialogProps {
  onConfirm: () => void;
}

export const RosterConfirmDialog = ({
  onConfirm,
}: RosterConfirmDialogProps): JSX.Element => {
  const { useTeams } = useTournament();
  const { id, close } = useRosterConfirmDialog();

  const competitorCount = 11;
  const inactiveCompetitors = [];

  return (
    <ControlledDialog id={id} className={styles.RosterConfirmDialog} width="small">
      <DialogHeader title={`Confirm Round 2 ${useTeams ? 'Teams' : 'Players'}`} onCancel={close} />
      <DialogDescription>
        <p>{`The following ${useTeams ? ('team' + (inactiveCompetitors.length > 1 ? 's are' : ' is')) : 'player(s)'} not listed as checked in and will not be included in the pairing process.`}</p>
        {competitorCount % 2 && (
          <p>{'There is an odd number of competitors, so one competitor will remain unpaired and receive a bye.'}</p>
        )}
      </DialogDescription>
      <DialogActions>
        <Button variant="secondary" onClick={close}>Cancel</Button>
        <Button intent="danger" onClick={onConfirm}>{`Confirm ${useTeams ? 'Teams' : 'Players'}`}</Button>
      </DialogActions>
    </ControlledDialog>
  );
};
