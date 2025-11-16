import { DraftTournamentPairing, TournamentCompetitor } from '~/api';
import { ColumnDef } from '~/components/generic/Table';
import { TournamentPairingRow } from '~/components/TournamentPairingRow';
import { TournamentPairingFormItem } from '../../TournamentPairingsPage.schema';

import styles from './ConfirmPairingsDialog.module.scss';

export const getTableColumns = (competitors: TournamentCompetitor[]): ColumnDef<DraftTournamentPairing>[] => [
  {
    key: 'table',
    label: 'Table',
    width: 40,
    xAlign: 'center',
    renderCell: (r) => (
      <div className={styles.ConfirmPairingsDialog_Table}>
        {r.table === null ? '-' : r.table + 1}
      </div>
    ),
  },
  {
    key: 'pairing',
    label: 'Pairing',
    xAlign: 'center',
    renderCell: (r) => {
      const tournamentCompetitor0 = competitors.find((c) => c._id === r.tournamentCompetitor0Id) ?? null;
      const tournamentCompetitor1 = competitors.find((c) => c._id === r.tournamentCompetitor1Id) ?? null;
      if (!tournamentCompetitor0) {
        return null;
      }
      return (
        <TournamentPairingRow
          pairing={{
            table: r.table,
            tournamentCompetitor0,
            tournamentCompetitor1,
          }}
          className={styles.ConfirmPairingsDialog_Pairing}
        />
      );
    },
  },
];

export const assignTables = (
  pairings: (TournamentPairingFormItem & {
    playedTables: (number | null)[];
  })[],
  tableCount: number,
): DraftTournamentPairing[] => {

  // Get tables already in use:
  const usedTables = new Set(pairings.filter((p) => p.table !== null && p.table > -1).map((p) => p.table));

  // Create pool of available tables:
  const availableTables = Array.from({ length: tableCount }, (_, i) => i).filter((table) => !usedTables.has(table));

  const assignedPairings = [];

  for (const { playedTables, ...pairing } of pairings) {
    const ids = [
      pairing.tournamentCompetitor0Id,
      pairing.tournamentCompetitor1Id,
    ].filter((id) => id !== null);

    // If not a bye...
    if (ids.length === 2) {
      const fullPairing = {
        ...pairing,
        tournamentCompetitor0Id: ids[0],
        tournamentCompetitor1Id: ids[1],
      };

      // ...and the table is assigned, don't do anything:
      if (pairing.table !== -1) {
        assignedPairings.push(fullPairing);
      } else {
        // Otherwise, find best available table (prefer unplayed tables):
        const table = availableTables.find((table) => !playedTables.includes(table)) ?? availableTables[0] ?? null;

        // Remove assigned table from available pool:
        const index = availableTables.indexOf(table);
        if (index > -1) {
          availableTables.splice(index, 1);
        }

        assignedPairings.push({
          ...fullPairing,
          table,
        });
      }

    }

    // If it is a bye, force table to be null:
    if (ids.length === 1) {
      assignedPairings.push({
        table: null,
        tournamentCompetitor0Id: ids[0],
        tournamentCompetitor1Id: null,
      });
    }

    // Ignore pairings which are empty.
  }
  return assignedPairings.sort((a, b) => {
    if (a.table === null) {
      return 1;
    }
    if (b.table === null) {
      return -1;
    }
    return a.table - b.table;
  });
};
