import { DraftTournamentPairing, TournamentCompetitor } from '~/api';
import { ConfirmationDialog } from '~/components/ConfirmationDialog';
import { Table } from '~/components/generic/Table';
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
  console.log('pairings', pairings);
  const { maxCompetitors, nextRound } = useTournament();
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
  const nextRoundLabel = (nextRound ?? 0) + 1;
  return (
    <ConfirmationDialog
      id={id}
      title={`Confirm Round ${nextRoundLabel} Pairings`}
      onConfirm={handleConfirm}
      disablePadding
    >
      <p className={styles.ConfirmPairingsDialog_Content}>
        Round {nextRoundLabel} will have the following parings:
      </p>
      <Table columns={columns} rows={assignedPairings} rowClassName={styles.ConfirmPairingsDialog_Row} />
    </ConfirmationDialog>
  );
};
