import { Id } from '../../../_generated/dataModel';
import { DeepTournamentCompetitor } from '../../tournamentCompetitors';
import { TournamentDeep } from '../../tournaments';
import { DraftTournamentPairing } from '..';

export const assignTables = (
  pairings: DraftTournamentPairing[],
  data: {
    tournament: TournamentDeep,
    tournamentCompetitors: DeepTournamentCompetitor[],
  },
): DraftTournamentPairing[] => {

  // Use a map for more efficient look-up of played tables:
  const playedTablesMap = new Map<Id<'tournamentCompetitors'> | null, number[]>(
    data.tournamentCompetitors.map((c) => [c._id, c.playedTables]),
  );
  playedTablesMap.set(null, []);

  const tableCount = (data.tournament?.competitorCount ?? 2) / 2; // TODO: Use actual table count

  const draftPairings = pairings.map((p) => ({
    ...p,
    playedTables: Array.from(new Set([
      ...(playedTablesMap.get(p.tournamentCompetitor0Id) ?? []),
      ...(playedTablesMap.get(p.tournamentCompetitor1Id) ?? []),
    ])),
  }));

  const availableTables = new Set(Array.from({ length: tableCount }, (_, i) => i));

  // Step 1: Organize pairings by which DO need tables and which DON'T:
  const autoAssignedPairings = [];
  const manuallyAssignedPairings = [];

  for (const { playedTables, ...pairing } of draftPairings) {
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
  // Step 2: Randomly assign tables to pairings that need them:
  const availableTablesList = Array.from(availableTables);
  for (let i = 0; i < autoAssignedPairings.length; i++) {
    const randomIndex = Math.floor(Math.random() * availableTablesList.length);
    autoAssignedPairings[i].table = availableTablesList[randomIndex];
    availableTablesList.splice(randomIndex, 1);
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
