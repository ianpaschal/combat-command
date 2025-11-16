import { DraftTournamentPairing, TournamentCompetitor } from '~/api';
import { ConfirmationDialog } from '~/components/ConfirmationDialog';
import { Table } from '~/components/generic/Table';
import { Warning } from '~/components/generic/Warning';
import { useTournament } from '~/components/TournamentProvider';
import { TournamentPairingFormItem } from '../../TournamentPairingsPage.schema';
import { assignTables, getTableColumns } from './ConfirmPairingsDialog.utils';

import styles from './ConfirmPairingsDialog.module.scss';

export interface ConfirmPairingsDialogProps {
  competitors: TournamentCompetitor[];
  id: string;
  onConfirm: (assignedPairings: DraftTournamentPairing[]) => void;
  pairings: TournamentPairingFormItem[];
}

export const ConfirmPairingsDialog = ({
  competitors,
  id,
  onConfirm,
  pairings,
}: ConfirmPairingsDialogProps): JSX.Element => {
  const { maxCompetitors } = useTournament();

  const assignedPairings = assignTables(pairings.filter((pairing) => (
    pairing.tournamentCompetitor0Id || pairing.tournamentCompetitor1Id
  )).map((pairing) => ({
    ...pairing,
    playedTables: Array.from(new Set([
      ...competitors.find((c) => c._id === pairing.tournamentCompetitor0Id)?.playedTables ?? [],
      ...competitors.find((c) => c._id === pairing.tournamentCompetitor1Id)?.playedTables ?? [],
    ])),
  })), Math.ceil(maxCompetitors / 2));

  const handleConfirm = (): void => {
    onConfirm(assignedPairings);
  };

  const columns = getTableColumns(competitors);

  return (
    <ConfirmationDialog
      id={id}
      title="Confirm Pairings"
      onConfirm={handleConfirm}
      disablePadding
    >
      <p className={styles.ConfirmPairingsDialog_Content}>
        The following pairings will be created:
      </p>
      <Table columns={columns} rows={assignedPairings} />
      <Warning className={styles.ConfirmPairingsDialog_Content}>
        Once created, pairings cannot be edited. Please ensure all competitors are present and ready to play!
      </Warning>
    </ConfirmationDialog>
  );
};
