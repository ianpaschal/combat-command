import { DraftTournamentPairing, TournamentCompetitor } from '~/api';
import { ConfirmationDialog } from '~/components/ConfirmationDialog';
import { ColumnDef, Table } from '~/components/generic/Table';
import { Warning } from '~/components/generic/Warning';
import { TournamentPairingRow } from '~/components/TournamentPairingRow';
import { useTournament } from '~/components/TournamentProvider';
import { TournamentPairingFormItem } from '../../TournamentPairingsPage.schema';
import { assignTables } from './ConfirmPairingsDialog.utils';

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

  const columns: ColumnDef<DraftTournamentPairing>[] = [
    {
      key: 'table',
      label: 'Table',
      width: 40,
      align: 'center',
      renderCell: (r) => (
        <div className={styles.ConfirmPairingsDialog_Table}>
          {r.table === null ? '-' : r.table + 1}
        </div>
      ),
    },
    {
      key: 'pairing',
      label: 'Pairing',
      align: 'center',
      renderCell: (r) => (
        <TournamentPairingRow
          pairing={r}
          className={styles.ConfirmPairingsDialog_Pairing}
        />
      ),
    },
  ];

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
      <Table columns={columns} rows={assignedPairings} rowClassName={styles.ConfirmPairingsDialog_Row} />
      <Warning className={styles.ConfirmPairingsDialog_Content}>
        Once created, pairings cannot be edited. Please ensure all competitors are present and ready to play!
      </Warning>
    </ConfirmationDialog>
  );
};
