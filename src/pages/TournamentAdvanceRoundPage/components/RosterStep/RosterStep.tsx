import {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useMemo,
} from 'react';
import { Plus } from 'lucide-react';

import { ConfirmationDialog, useConfirmationDialog } from '~/components/ConfirmationDialog';
import { Button } from '~/components/generic/Button';
import { Separator } from '~/components/generic/Separator';
import { TournamentCompetitorCreateDialog, useTournamentCompetitorCreateDialog } from '~/components/TournamentCompetitorCreateDialog';
import { useTournamentCompetitors } from '~/components/TournamentCompetitorsProvider';
import { useTournament } from '~/components/TournamentProvider';
import { TournamentRoster } from '~/components/TournamentRoster';

import { getWarnings, sortCompetitorsByActive } from './RosterStep.utils';

import styles from './RosterStep.module.scss';

const tournamentRosterConfirmDialogId = 'tournament-roster-confirm';

export interface RosterStepProps {
  nextRound: number;
  onConfirm: () => void;
}

export interface RosterStepHandle {
  validate: () => void;
}

export const RosterStep = forwardRef<RosterStepHandle, RosterStepProps>(({
  onConfirm,
  nextRound,
}: RosterStepProps, ref) => {
  const tournament = useTournament();
  const tournamentCompetitors = useTournamentCompetitors();
  const { open: openTournamentCompetitorCreateDialog } = useTournamentCompetitorCreateDialog();
  const {
    open: openTournamentRosterConfirmDialog,
    close: closeTournamentRosterConfirmDialog,
  } = useConfirmationDialog(tournamentRosterConfirmDialogId);

  const sortedCompetitors = sortCompetitorsByActive(tournamentCompetitors);

  useImperativeHandle(ref, () => ({
    validate: () => {
      if (!sortedCompetitors.active.length) {
        // TODO: Use a toast instead and return
        throw new Error('No competitors');
      }
      if (sortedCompetitors.active.length > tournament.maxCompetitors) {
        // TODO: Use a toast instead and return
        throw new Error('Too many competitors!');
      }
      if (warnings.length > 0) {
        openTournamentRosterConfirmDialog();
      } else {
        onConfirm();
      }
    },
  }));

  const handleConfirm = () => {
    closeTournamentRosterConfirmDialog();
    onConfirm();
  };

  const warnings: ReactNode[] = useMemo(() => getWarnings(tournament, tournamentCompetitors), [
    tournament,
    tournamentCompetitors,
  ]);

  return (
    <>
      <div className={styles.RosterStep}>
        <div className={styles.RosterStep_Header}>
          <h2>
            {`Adjust ${tournament.useTeams ? 'Teams' : 'Players'}`}
          </h2>
          <div className={styles.RosterStep_Actions}>
            <Button variant="secondary" onClick={openTournamentCompetitorCreateDialog}>
              <Plus />
              {`Add ${tournament.useTeams ? 'Team' : 'Player'}`}
            </Button>
          </div>
        </div>
        <Separator />
        <TournamentRoster />
      </div>
      <TournamentCompetitorCreateDialog />
      <ConfirmationDialog
        id={tournamentRosterConfirmDialogId}
        title={`Confirm Round ${nextRound + 1} ${tournament.useTeams ? 'Teams' : 'Players'}`}
        onConfirm={handleConfirm}
        intent="default"
        warnings={warnings}
      />
    </>
  );
});
