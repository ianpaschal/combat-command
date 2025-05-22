import { CircleAlert } from 'lucide-react';

import { Button } from '~/components/generic/Button';
import {
  ControlledDialog,
  DialogActions,
  DialogHeader,
} from '~/components/generic/Dialog';
import { IdentityBadge } from '~/components/IdentityBadge';
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
  const { id, data: sortedCompetitors, close } = useRosterConfirmDialog();

  const activeCompetitorCount = sortedCompetitors?.active.length ?? 0;
  const showOddCompetitorCountWarning = activeCompetitorCount % 2;

  const inactiveCompetitorCount = sortedCompetitors?.inactive.length ?? 0;
  const showInactiveCompetitorsWarning = inactiveCompetitorCount > 0;

  return (
    <ControlledDialog id={id} width="small">
      <DialogHeader title={`Confirm Round 2 ${useTeams ? 'Teams' : 'Players'}`} onCancel={close} />
      <div className={styles.RosterConfirmDialog}>
        {showInactiveCompetitorsWarning && (
          <div className={styles.RosterConfirmDialog_WarningBlurb}>
            <CircleAlert className={styles.RosterConfirmDialog_WarningBlurb_Icon} />
            <h3 className={styles.RosterConfirmDialog_WarningBlurb_Header}>
              Warning
            </h3>
            <div className={styles.RosterConfirmDialog_WarningBlurb_Body}>
              <p>
                {`The following ${useTeams ? ('team' + (inactiveCompetitorCount > 1 ? 's are' : ' is')) : 'player(s)'} not listed as checked in and will not be included in the pairing process for round 2.`}
              </p>
              {sortedCompetitors?.inactive.map((tournamentCompetitor) => (
                <IdentityBadge size="small" competitor={tournamentCompetitor} />
              ))}
            </div>
          </div>
        )}
        {showOddCompetitorCountWarning && (
          <div className={styles.RosterConfirmDialog_WarningBlurb}>
            <CircleAlert className={styles.RosterConfirmDialog_WarningBlurb_Icon} />
            <h3 className={styles.RosterConfirmDialog_WarningBlurb_Header}>
              Warning
            </h3>
            <div className={styles.RosterConfirmDialog_WarningBlurb_Body}>
              <p>
                {`There is an odd number of competitors, so one competitor will remain unpaired. As tournament organizer, you will need to submit match results for the ${useTeams ? 'team' : 'player'} with a bye, with the desired outcome.`}
              </p>
            </div>
          </div>
        )}
      </div>
      <DialogActions>
        <Button variant="secondary" onClick={close}>Cancel</Button>
        <Button onClick={onConfirm}>{`Confirm ${useTeams ? 'Teams' : 'Players'}`}</Button>
      </DialogActions>
    </ControlledDialog>
  );
};
