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
  const availableTables = new Set(Array.from({ length: tableCount }, (_, i) => i));

  // Step 1: Organize pairings by which DO need tables and which DON'T:
  const autoAssignedPairings = [];
  const manuallyAssignedPairings = [];

  for (const { playedTables, ...pairing } of pairings) {
    const ids = [
      pairing.tournamentCompetitor0Id,
      pairing.tournamentCompetitor1Id,
    ].filter((id) => id !== null);

    // Handle byes (no table needed):
    if (ids.length === 1) {
      manuallyAssignedPairings.push({
        table: null,
        tournamentCompetitor0Id: ids[0],
        tournamentCompetitor1Id: null,
        playedTables: [],
      });
      continue;
    }

    // Handle 2-competitor pairings:
    if (ids.length === 2) {
      if (pairing.table !== null && pairing.table !== -1) {
        manuallyAssignedPairings.push({
          table: pairing.table,
          tournamentCompetitor0Id: ids[0],
          tournamentCompetitor1Id: ids[1],
          playedTables,
        });
        availableTables.delete(pairing.table);
      } else {
        autoAssignedPairings.push({
          table: -1, // Will be assigned below
          tournamentCompetitor0Id: ids[0],
          tournamentCompetitor1Id: ids[1],
          playedTables,
        });
      }
    }
  }

  if (availableTables.size < autoAssignedPairings.length) {
    throw new Error('There are more unassigned pairings than available tables!');
  }

  // Step 2: Randomly assign tables to pairings that need them:
  for (let i = 0; i < autoAssignedPairings.length; i++) {
    const randomTable = Array.from(availableTables)[Math.floor(Math.random() * availableTables.size)];
    autoAssignedPairings[i].table = randomTable;
    availableTables.delete(randomTable);
  }

  // Step 3: Optimization pass - try to swap tables to avoid repeats:
  for (let i = 0; i < autoAssignedPairings.length; i++) {
    const current = autoAssignedPairings[i];

    // Check if current pairing has a table conflict (either competitor played here before)
    const hasConflict = current.playedTables.includes(current.table);

    if (!hasConflict) {
      continue; // No need to swap if no conflict
    }

    // Try to find a swap partner
    for (let j = 0; j < autoAssignedPairings.length; j++) {
      if (i === j) {
        continue;
      }

      const partner = autoAssignedPairings[j];

      // Check if swapping would benefit both pairings:
      // - Partner's table should not be in current's playedTables
      // - Current's table should not be in partner's playedTables
      const currentWouldBenefitFromSwap = !current.playedTables.includes(partner.table);
      const partnerWouldBenefitFromSwap = !partner.playedTables.includes(current.table);

      if (currentWouldBenefitFromSwap && partnerWouldBenefitFromSwap) {
        // Perform the swap
        const temp = current.table;
        current.table = partner.table;
        partner.table = temp;
        break; // Move to next pairing after successful swap
      }
    }
  }

  // Step 4: Sort by table number and return:
  return [
    ...autoAssignedPairings,
    ...manuallyAssignedPairings,
  ].map(({ playedTables: _, ...pairing }) => pairing).sort((a, b) => {
    if (a.table === null) {
      return 1;
    }
    if (b.table === null) {
      return -1;
    }
    return a.table - b.table;
  });
};
