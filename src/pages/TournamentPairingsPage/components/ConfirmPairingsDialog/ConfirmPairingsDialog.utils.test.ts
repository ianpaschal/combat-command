import {
  describe,
  expect,
  it,
} from 'vitest';

import { TournamentCompetitorId } from '~/api';
import { TournamentPairingFormItem } from '../../TournamentPairingsPage.schema';
import { assignTables } from './ConfirmPairingsDialog.utils';

describe('assignTables', () => {
  it('assigns tables to basic pairings', () => {
    const pairings: (TournamentPairingFormItem & { playedTables: (number | null)[] })[] = [
      {
        table: -1,
        tournamentCompetitor0Id: 'player1' as TournamentCompetitorId,
        tournamentCompetitor1Id: 'player2' as TournamentCompetitorId,
        playedTables: [],
      },
      {
        table: -1,
        tournamentCompetitor0Id: 'player3' as TournamentCompetitorId,
        tournamentCompetitor1Id: 'player4' as TournamentCompetitorId,
        playedTables: [],
      },
    ];

    const result = assignTables(pairings, 4);

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
    const pairings: (TournamentPairingFormItem & { playedTables: (number | null)[] })[] = [
      {
        table: -1,
        tournamentCompetitor0Id: 'player1' as TournamentCompetitorId,
        tournamentCompetitor1Id: null,
        playedTables: [],
      },
    ];

    const result = assignTables(pairings, 4);

    expect(result).toHaveLength(1);
    expect(result[0].table).toBe(null);
    expect(result[0].tournamentCompetitor0Id).toBe('player1');
    expect(result[0].tournamentCompetitor1Id).toBe(null);
  });

  it('preserves pre-assigned tables', () => {
    const pairings: (TournamentPairingFormItem & { playedTables: (number | null)[] })[] = [
      {
        table: 1,
        tournamentCompetitor0Id: 'player1' as TournamentCompetitorId,
        tournamentCompetitor1Id: 'player2' as TournamentCompetitorId,
        playedTables: [],
      },
      {
        table: -1,
        tournamentCompetitor0Id: 'player3' as TournamentCompetitorId,
        tournamentCompetitor1Id: 'player4' as TournamentCompetitorId,
        playedTables: [],
      },
    ];

    const result = assignTables(pairings, 2);

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
    const pairings: (TournamentPairingFormItem & { playedTables: (number | null)[] })[] = [
      {
        table: -1,
        tournamentCompetitor0Id: 'player1' as TournamentCompetitorId,
        tournamentCompetitor1Id: null,
        playedTables: [],
      },
      {
        table: -1,
        tournamentCompetitor0Id: 'player2' as TournamentCompetitorId,
        tournamentCompetitor1Id: 'player3' as TournamentCompetitorId,
        playedTables: [],
      },
    ];

    const result = assignTables(pairings, 4);

    expect(result[0].table).not.toBe(null); // Regular pairing comes first
    expect(result[1].table).toBe(null); // Bye comes last
  });

  it('never assigns the same table to two different pairings', () => {
    const pairings: (TournamentPairingFormItem & { playedTables: (number | null)[] })[] = [
      {
        table: -1,
        tournamentCompetitor0Id: 'player1' as TournamentCompetitorId,
        tournamentCompetitor1Id: 'player2' as TournamentCompetitorId,
        playedTables: [0, 1],
      },
      {
        table: -1,
        tournamentCompetitor0Id: 'player3' as TournamentCompetitorId,
        tournamentCompetitor1Id: 'player4' as TournamentCompetitorId,
        playedTables: [0, 1],
      },
    ];

    const result = assignTables(pairings, 2);

    expect(result).toHaveLength(2);
    expect(result[0].table).not.toBe(result[1].table);
    expect(result[0].table).toBeGreaterThanOrEqual(0);
    expect(result[0].table).toBeLessThan(2);
    expect(result[1].table).toBeGreaterThanOrEqual(0);
    expect(result[1].table).toBeLessThan(2);
  });

  it('attempts to avoid tables players have already played on', () => {
    const pairings: (TournamentPairingFormItem & { playedTables: (number | null)[] })[] = [
      {
        table: -1,
        tournamentCompetitor0Id: 'player1' as TournamentCompetitorId,
        tournamentCompetitor1Id: 'player2' as TournamentCompetitorId,
        playedTables: [0], // Played on table 0
      },
      {
        table: -1,
        tournamentCompetitor0Id: 'player3' as TournamentCompetitorId,
        tournamentCompetitor1Id: 'player4' as TournamentCompetitorId,
        playedTables: [1], // Played on table 1
      },
    ];

    const result = assignTables(pairings, 4);

    const pairing1 = result.find((p) => p.tournamentCompetitor0Id === 'player1');
    const pairing2 = result.find((p) => p.tournamentCompetitor0Id === 'player3');

    // With 4 tables and only 2 pairings, there's plenty of room to avoid conflicts
    // Due to random assignment and swapping logic, we can't guarantee exact tables,
    // but we can verify no duplicates
    expect(pairing1?.table).not.toBe(pairing2?.table);
  });

  it('performs swaps to optimize table assignments', () => {
    // Create a scenario where swapping would help:
    // Player1+2 have played [0], Player3+4 have played [1]
    // Using auto-assignment (table: -1) to test the swap optimization logic
    const pairings: (TournamentPairingFormItem & { playedTables: (number | null)[] })[] = [
      {
        table: -1, // Auto-assign so swap logic can optimize
        tournamentCompetitor0Id: 'player1' as TournamentCompetitorId,
        tournamentCompetitor1Id: 'player2' as TournamentCompetitorId,
        playedTables: [0], // Have played on table 0
      },
      {
        table: -1, // Auto-assign so swap logic can optimize
        tournamentCompetitor0Id: 'player3' as TournamentCompetitorId,
        tournamentCompetitor1Id: 'player4' as TournamentCompetitorId,
        playedTables: [1], // Have played on table 1
      },
    ];

    const result = assignTables(pairings, 2);

    const pairing1 = result.find((p) => p.tournamentCompetitor0Id === 'player1');
    const pairing2 = result.find((p) => p.tournamentCompetitor0Id === 'player3');

    // With the optimization logic, tables should be assigned to avoid conflicts
    // player1+2 should NOT be on table 0, player3+4 should NOT be on table 1
    expect(pairing1?.table).not.toBe(0);
    expect(pairing2?.table).not.toBe(1);
  });

  it('handles complex scenarios with multiple rounds of play history', () => {
    const pairings: (TournamentPairingFormItem & { playedTables: (number | null)[] })[] = [
      {
        table: -1,
        tournamentCompetitor0Id: 'player1' as TournamentCompetitorId,
        tournamentCompetitor1Id: 'player2' as TournamentCompetitorId,
        playedTables: [0, 1, 2], // Played on tables 0, 1, 2
      },
      {
        table: -1,
        tournamentCompetitor0Id: 'player3' as TournamentCompetitorId,
        tournamentCompetitor1Id: 'player4' as TournamentCompetitorId,
        playedTables: [1, 2, 3], // Played on tables 1, 2, 3
      },
      {
        table: -1,
        tournamentCompetitor0Id: 'player5' as TournamentCompetitorId,
        tournamentCompetitor1Id: 'player6' as TournamentCompetitorId,
        playedTables: [0, 2, 4], // Played on tables 0, 2, 4
      },
    ];

    const result = assignTables(pairings, 5);

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
    const pairings: (TournamentPairingFormItem & { playedTables: (number | null)[] })[] = [
      {
        table: -1,
        tournamentCompetitor0Id: 'player1' as TournamentCompetitorId,
        tournamentCompetitor1Id: 'player2' as TournamentCompetitorId,
        playedTables: [],
      },
      {
        table: -1,
        tournamentCompetitor0Id: 'player3' as TournamentCompetitorId,
        tournamentCompetitor1Id: 'player4' as TournamentCompetitorId,
        playedTables: [],
      },
      {
        table: -1,
        tournamentCompetitor0Id: 'player5' as TournamentCompetitorId,
        tournamentCompetitor1Id: 'player6' as TournamentCompetitorId,
        playedTables: [],
      },
    ];

    // With only 2 tables and 3 pairings, an error should be thrown
    expect(() => assignTables(pairings, 2)).toThrowError();
  });

  it('ignores empty pairings', () => {
    const pairings: (TournamentPairingFormItem & { playedTables: (number | null)[] })[] = [
      {
        table: -1,
        tournamentCompetitor0Id: null,
        tournamentCompetitor1Id: null,
        playedTables: [],
      },
      {
        table: -1,
        tournamentCompetitor0Id: 'player1' as TournamentCompetitorId,
        tournamentCompetitor1Id: 'player2' as TournamentCompetitorId,
        playedTables: [],
      },
    ];

    const result = assignTables(pairings, 4);

    // Only the non-empty pairing should be returned
    expect(result).toHaveLength(1);
    expect(result[0].tournamentCompetitor0Id).toBe('player1');
  });
});
