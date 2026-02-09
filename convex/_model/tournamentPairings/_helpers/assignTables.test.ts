import {
  describe,
  expect,
  it,
} from 'vitest';

import { createMockTournamentCompetitors } from '../../../_fixtures/createMockTournamentCompetitor';
import { Id } from '../../../_generated/dataModel';
import { DeepTournamentCompetitor } from '../../tournamentCompetitors';
import { TournamentDeep } from '../../tournaments';
import { DraftTournamentPairing } from '..';
import { assignTables } from './assignTables';

const createMockTournament = (competitorCount: number): TournamentDeep => ({
  competitorCount,
}) as TournamentDeep;

const createMockData = (
  competitorCount: number,
  playedTablesMap: Record<string, number[]> = {},
): { tournament: TournamentDeep; tournamentCompetitors: DeepTournamentCompetitor[] } => {
  const tournamentCompetitors = createMockTournamentCompetitors(competitorCount);

  // Apply playedTables overrides
  for (const [id, playedTables] of Object.entries(playedTablesMap)) {
    const competitor = tournamentCompetitors.find((c) => c._id === id);
    if (competitor) {
      competitor.playedTables = playedTables;
    }
  }

  return {
    tournament: createMockTournament(competitorCount),
    tournamentCompetitors,
  };
};

describe('assignTables', () => {
  it('assigns tables to basic pairings', () => {
    const pairings: DraftTournamentPairing[] = [
      {
        table: -1,
        tournamentCompetitor0Id: 'player1' as Id<'tournamentCompetitors'>,
        tournamentCompetitor1Id: 'player2' as Id<'tournamentCompetitors'>,
      },
      {
        table: -1,
        tournamentCompetitor0Id: 'player3' as Id<'tournamentCompetitors'>,
        tournamentCompetitor1Id: 'player4' as Id<'tournamentCompetitors'>,
      },
    ];

    const data = {
      tournament: createMockTournament(8), // 8 competitors = 4 tables
      tournamentCompetitors: [] as DeepTournamentCompetitor[],
    };

    const result = assignTables(pairings, data);

    expect(result).toHaveLength(2);

    // Tables should be assigned (could be any available tables due to randomization)
    expect(result[0].table).toBeGreaterThanOrEqual(0);
    expect(result[0].table).toBeLessThan(4);
    expect(result[1].table).toBeGreaterThanOrEqual(0);
    expect(result[1].table).toBeLessThan(4);

    // Should not have the same table:
    expect(result[0].table).not.toBe(result[1].table);
  });

  it('handles byes correctly', () => {
    const pairings: DraftTournamentPairing[] = [
      {
        table: -1,
        tournamentCompetitor0Id: 'player1' as Id<'tournamentCompetitors'>,
        tournamentCompetitor1Id: null,
      },
    ];

    const data = {
      tournament: createMockTournament(8),
      tournamentCompetitors: [] as DeepTournamentCompetitor[],
    };

    const result = assignTables(pairings, data);

    expect(result).toHaveLength(1);
    expect(result[0].table).toBe(null);
    expect(result[0].tournamentCompetitor0Id).toBe('player1');
    expect(result[0].tournamentCompetitor1Id).toBe(null);
  });

  it('preserves pre-assigned tables', () => {
    const pairings: DraftTournamentPairing[] = [
      {
        table: 1,
        tournamentCompetitor0Id: 'player1' as Id<'tournamentCompetitors'>,
        tournamentCompetitor1Id: 'player2' as Id<'tournamentCompetitors'>,
      },
      {
        table: -1,
        tournamentCompetitor0Id: 'player3' as Id<'tournamentCompetitors'>,
        tournamentCompetitor1Id: 'player4' as Id<'tournamentCompetitors'>,
      },
    ];

    const data = {
      tournament: createMockTournament(4), // 4 competitors = 2 tables
      tournamentCompetitors: [] as DeepTournamentCompetitor[],
    };

    const result = assignTables(pairings, data);

    const preAssignedPairing = result.find(
      (p) => p.tournamentCompetitor0Id === 'player1',
    );
    expect(preAssignedPairing?.table).toBe(1);

    const newPairing = result.find(
      (p) => p.tournamentCompetitor0Id === 'player3',
    );
    expect(newPairing?.table).not.toBe(1); // Should get a different table
    expect(newPairing?.table).toBeGreaterThanOrEqual(0);
  });

  it('sorts byes to the end', () => {
    const pairings: DraftTournamentPairing[] = [
      {
        table: -1,
        tournamentCompetitor0Id: 'player1' as Id<'tournamentCompetitors'>,
        tournamentCompetitor1Id: null,
      },
      {
        table: -1,
        tournamentCompetitor0Id: 'player2' as Id<'tournamentCompetitors'>,
        tournamentCompetitor1Id: 'player3' as Id<'tournamentCompetitors'>,
      },
    ];

    const data = {
      tournament: createMockTournament(8),
      tournamentCompetitors: [] as DeepTournamentCompetitor[],
    };

    const result = assignTables(pairings, data);

    expect(result[0].table).not.toBe(null); // Regular pairing comes first
    expect(result[1].table).toBe(null); // Bye comes last
  });

  it('never assigns the same table to two different pairings', () => {
    const pairings: DraftTournamentPairing[] = [
      {
        table: -1,
        tournamentCompetitor0Id: 'C0' as Id<'tournamentCompetitors'>,
        tournamentCompetitor1Id: 'C1' as Id<'tournamentCompetitors'>,
      },
      {
        table: -1,
        tournamentCompetitor0Id: 'C2' as Id<'tournamentCompetitors'>,
        tournamentCompetitor1Id: 'C3' as Id<'tournamentCompetitors'>,
      },
    ];

    // Create competitors with playedTables
    const data = createMockData(4);
    data.tournamentCompetitors[0].playedTables = [0, 1];
    data.tournamentCompetitors[1].playedTables = [0, 1];
    data.tournamentCompetitors[2].playedTables = [0, 1];
    data.tournamentCompetitors[3].playedTables = [0, 1];

    const result = assignTables(pairings, data);

    expect(result).toHaveLength(2);
    expect(result[0].table).not.toBe(result[1].table);
    expect(result[0].table).toBeGreaterThanOrEqual(0);
    expect(result[0].table).toBeLessThan(2);
    expect(result[1].table).toBeGreaterThanOrEqual(0);
    expect(result[1].table).toBeLessThan(2);
  });

  it('attempts to avoid tables players have already played on', () => {
    const pairings: DraftTournamentPairing[] = [
      {
        table: -1,
        tournamentCompetitor0Id: 'C0' as Id<'tournamentCompetitors'>,
        tournamentCompetitor1Id: 'C1' as Id<'tournamentCompetitors'>,
      },
      {
        table: -1,
        tournamentCompetitor0Id: 'C2' as Id<'tournamentCompetitors'>,
        tournamentCompetitor1Id: 'C3' as Id<'tournamentCompetitors'>,
      },
    ];

    // Create competitors with playedTables
    const data = createMockData(8); // 8 competitors = 4 tables
    data.tournamentCompetitors[0].playedTables = [0]; // C0 played on table 0
    data.tournamentCompetitors[1].playedTables = [0]; // C1 played on table 0
    data.tournamentCompetitors[2].playedTables = [1]; // C2 played on table 1
    data.tournamentCompetitors[3].playedTables = [1]; // C3 played on table 1

    const result = assignTables(pairings, data);

    const pairing1 = result.find((p) => p.tournamentCompetitor0Id === 'C0');
    const pairing2 = result.find((p) => p.tournamentCompetitor0Id === 'C2');

    // With 4 tables and only 2 pairings, there's plenty of room to avoid conflicts
    // Due to random assignment and swapping logic, we can't guarantee exact tables,
    // but we can verify no duplicates
    expect(pairing1?.table).not.toBe(pairing2?.table);
  });

  it('performs swaps to optimize table assignments', () => {
    // Create a scenario where swapping would help:
    // C0+C1 have played [0], C2+C3 have played [1]
    // Using auto-assignment (table: -1) to test the swap optimization logic
    const pairings: DraftTournamentPairing[] = [
      {
        table: -1, // Auto-assign so swap logic can optimize
        tournamentCompetitor0Id: 'C0' as Id<'tournamentCompetitors'>,
        tournamentCompetitor1Id: 'C1' as Id<'tournamentCompetitors'>,
      },
      {
        table: -1, // Auto-assign so swap logic can optimize
        tournamentCompetitor0Id: 'C2' as Id<'tournamentCompetitors'>,
        tournamentCompetitor1Id: 'C3' as Id<'tournamentCompetitors'>,
      },
    ];

    // Create competitors with playedTables
    const data = createMockData(4); // 4 competitors = 2 tables
    data.tournamentCompetitors[0].playedTables = [0]; // C0 played on table 0
    data.tournamentCompetitors[1].playedTables = [0]; // C1 played on table 0
    data.tournamentCompetitors[2].playedTables = [1]; // C2 played on table 1
    data.tournamentCompetitors[3].playedTables = [1]; // C3 played on table 1

    const result = assignTables(pairings, data);

    const pairing1 = result.find((p) => p.tournamentCompetitor0Id === 'C0');
    const pairing2 = result.find((p) => p.tournamentCompetitor0Id === 'C2');

    // With the optimization logic, tables should be assigned to avoid conflicts
    // C0+C1 should NOT be on table 0, C2+C3 should NOT be on table 1
    expect(pairing1?.table).not.toBe(0);
    expect(pairing2?.table).not.toBe(1);
  });

  it('handles complex scenarios with multiple rounds of play history', () => {
    const pairings: DraftTournamentPairing[] = [
      {
        table: -1,
        tournamentCompetitor0Id: 'C0' as Id<'tournamentCompetitors'>,
        tournamentCompetitor1Id: 'C1' as Id<'tournamentCompetitors'>,
      },
      {
        table: -1,
        tournamentCompetitor0Id: 'C2' as Id<'tournamentCompetitors'>,
        tournamentCompetitor1Id: 'C3' as Id<'tournamentCompetitors'>,
      },
      {
        table: -1,
        tournamentCompetitor0Id: 'C4' as Id<'tournamentCompetitors'>,
        tournamentCompetitor1Id: 'C5' as Id<'tournamentCompetitors'>,
      },
    ];

    // Create competitors with playedTables
    const data = createMockData(10); // 10 competitors = 5 tables
    data.tournamentCompetitors[0].playedTables = [0, 1, 2]; // C0
    data.tournamentCompetitors[1].playedTables = [0, 1, 2]; // C1
    data.tournamentCompetitors[2].playedTables = [1, 2, 3]; // C2
    data.tournamentCompetitors[3].playedTables = [1, 2, 3]; // C3
    data.tournamentCompetitors[4].playedTables = [0, 2, 4]; // C4
    data.tournamentCompetitors[5].playedTables = [0, 2, 4]; // C5

    const result = assignTables(pairings, data);

    // All pairings should have unique tables
    const tables = result.map((p) => p.table).filter((t) => t !== null);
    const uniqueTables = new Set(tables);
    expect(tables.length).toBe(uniqueTables.size);

    // Each pairing should have a valid table
    result.forEach((pairing) => {
      expect(pairing.table).toBeGreaterThanOrEqual(0);
      expect(pairing.table).toBeLessThan(5);
    });
  });

  it('throws error when there are more pairings than tables', () => {
    const pairings: DraftTournamentPairing[] = [
      {
        table: -1,
        tournamentCompetitor0Id: 'player1' as Id<'tournamentCompetitors'>,
        tournamentCompetitor1Id: 'player2' as Id<'tournamentCompetitors'>,
      },
      {
        table: -1,
        tournamentCompetitor0Id: 'player3' as Id<'tournamentCompetitors'>,
        tournamentCompetitor1Id: 'player4' as Id<'tournamentCompetitors'>,
      },
      {
        table: -1,
        tournamentCompetitor0Id: 'player5' as Id<'tournamentCompetitors'>,
        tournamentCompetitor1Id: 'player6' as Id<'tournamentCompetitors'>,
      },
    ];

    const data = {
      tournament: createMockTournament(4), // 4 competitors = 2 tables
      tournamentCompetitors: [] as DeepTournamentCompetitor[],
    };

    // With only 2 tables and 3 pairings, an error should be thrown
    expect(() => assignTables(pairings, data)).toThrowError();
  });

  it('ignores empty pairings', () => {
    const pairings: DraftTournamentPairing[] = [
      {
        table: -1,
        tournamentCompetitor0Id: null,
        tournamentCompetitor1Id: null,
      },
      {
        table: -1,
        tournamentCompetitor0Id: 'player1' as Id<'tournamentCompetitors'>,
        tournamentCompetitor1Id: 'player2' as Id<'tournamentCompetitors'>,
      },
    ];

    const data = {
      tournament: createMockTournament(8),
      tournamentCompetitors: [] as DeepTournamentCompetitor[],
    };

    const result = assignTables(pairings, data);

    // Only the non-empty pairing should be returned
    expect(result).toHaveLength(1);
    expect(result[0].tournamentCompetitor0Id).toBe('player1');
  });
});
