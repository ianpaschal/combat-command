import { Infer, v } from 'convex/values';
import blossom from 'edmonds-blossom';

import { Id } from '../../../_generated/dataModel';
import { PairingUniqueFields } from '../types';

export const unassignedTournamentPairingFields = v.object({
  playedTables: v.array(v.union(v.number(), v.null())),
  tournamentCompetitor0Id: v.id('tournamentCompetitors'),
  tournamentCompetitor1Id: v.union(v.id('tournamentCompetitors'), v.null()),
});

export type UnassignedTournamentPairing = Infer<typeof unassignedTournamentPairingFields>;

// TODO: DOCUMENTATION

export const generateTableAssignments = (
  draftPairings: {
    playedTables: (number | null)[],
    tournamentCompetitor0Id: Id<'tournamentCompetitors'>,
    tournamentCompetitor1Id: Id<'tournamentCompetitors'> | null,
  }[],
  tableCount: number,
): PairingUniqueFields[] => {
  const fullPairs = draftPairings.filter(
    p => p.tournamentCompetitor0Id && p.tournamentCompetitor1Id,
  );
  const partialPairs = draftPairings.filter(
    p => !p.tournamentCompetitor0Id || !p.tournamentCompetitor1Id,
  );

  const tableIndices = Array.from({ length: tableCount }, (_, i) => i);

  // Create a bipartite graph between full pairs and tables.
  // We minimize "repeats" by assigning higher weights to edges that go to "new" tables.

  const edges: [number, number, number][] = [];
  const tableOffset = fullPairs.length;

  fullPairs.forEach((pair, i) => {
    const playedTables = pair.playedTables;
    tableIndices.forEach(table => {
      const hasPlayed = playedTables.includes(table);
      const weight = hasPlayed ? 0 : 1; // Prefer unplayed tables (higher weight)
      edges.push([i, tableOffset + table, weight]);
    });
  });

  const match = blossom(edges);

  const assignedPairs: PairingUniqueFields[] = [];

  const usedTables = new Set<number>();

  // Match results come back as an array of matched node index => node index.
  const tableAssignments: Map<number, number> = new Map();

  match.forEach((matchedIdx, idx) => {
    if (idx < tableOffset && matchedIdx >= tableOffset) {
      const pairIndex = idx;
      const table = matchedIdx - tableOffset;
      tableAssignments.set(pairIndex, table);
      usedTables.add(table);
    }
  });

  // Process full pairs with assigned tables
  fullPairs.forEach(({ tournamentCompetitor0Id, tournamentCompetitor1Id }, index) => {
    const table = tableAssignments.get(index);
    assignedPairs.push({
      tournamentCompetitor0Id,
      tournamentCompetitor1Id,
      table: table ?? (() => {
        // If not matched, assign first available (even if it's a repeat)
        for (let t = 0; t < tableCount; t++) {
          if (!usedTables.has(t)) {
            usedTables.add(t);
            return t;
          }
        }
        // All tables used, allow repeats
        return index % tableCount;
      })(),
    });
  });

  // Process partial pairs by assigning them to remaining tables
  partialPairs.forEach(({ tournamentCompetitor0Id, tournamentCompetitor1Id }) => {
    assignedPairs.push({
      tournamentCompetitor0Id,
      tournamentCompetitor1Id,
      table: null, // If they don't play, don't make future table assignments more difficult by counting this one
    });
  });

  return assignedPairs;
};
