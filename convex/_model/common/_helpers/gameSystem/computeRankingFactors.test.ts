import {
  describe,
  expect,
  it,
} from 'vitest';

import { Id } from '../../../../_generated/dataModel';
import { computeRankingFactors } from './computeRankingFactors';

describe('computeRankingFactors', () => {
  type BaseStats = {
    points: number;
    wins: number;
  };

  const defaultValues: BaseStats = {
    points: 0,
    wins: 0,
  };

  it('should use default values when baseStats arrays are empty.', () => {
    const playerId = 'player1' as Id<'tournamentCompetitors'>;
    const stats = {
      [playerId]: {
        results: [] as (BaseStats & { opponentId: Id<'tournamentCompetitors'> | null })[],
      },
    };

    const result = computeRankingFactors(playerId, stats, defaultValues, 1);

    expect(result).toEqual({
      average_opponent_points: 0,
      average_opponent_wins: 0,
      average_points: 0,
      average_wins: 0,
      total_opponent_points: 0,
      total_opponent_wins: 0,
      total_points: 0,
      total_wins: 0,
    });
  });

  it('should compute ranking factors for single game with basic stats.', () => {
    const playerId = 'player1' as Id<'tournamentCompetitors'>;
    const opponentId = 'player2' as Id<'tournamentCompetitors'>;
    const stats = {
      [playerId]: {
        results: [{ points: 8, wins: 1, opponentId }],
      },
      [opponentId]: {
        results: [{ points: 1, wins: 0, opponentId: playerId }],
      },
    };

    const result = computeRankingFactors(playerId, stats, defaultValues, 1);

    expect(result).toEqual({
      average_opponent_points: 0,
      average_opponent_wins: 0,
      average_points: 8,
      average_wins: 1,
      total_opponent_points: 0,
      total_opponent_wins: 0,
      total_points: 8,
      total_wins: 1,
    });
  });

  it('should compute ranking factors for multiple games with opponents and byes.', () => {
    const roundsPlayed = 3;
    const playerId = 'player1' as Id<'tournamentCompetitors'>;
    const opponent1 = 'player2' as Id<'tournamentCompetitors'>;
    const opponent2 = 'player3' as Id<'tournamentCompetitors'>;

    const stats = {
      [playerId]: {
        results: [
          { points: 8, wins: 1, opponentId: opponent1 }, // 8:1 - vs. opponent1
          { points: 3, wins: 0, opponentId: opponent2 }, // 3:6 - vs. opponent2
          { points: 8, wins: 1, opponentId: null }, // 8:1 - Bye round
        ],
      },
      [opponent1]: {
        results: [
          { points: 1, wins: 0, opponentId: playerId }, // 1:8 - vs. player1 - excluded
          { points: 6, wins: 1, opponentId: opponent2 }, // 3:6 - vs. opponent2 - included
          { points: 8, wins: 1, opponentId: null }, // 8:1 - Bye round - included
        ],
      },
      [opponent2]: {
        results: [
          { points: 6, wins: 1, opponentId: playerId }, // 6:3 - vs. player1 - excluded
          { points: 3, wins: 0, opponentId: opponent1 }, // 3:6 - vs. opponent1 - included
          { points: 8, wins: 1, opponentId: null }, // 8:1 - Bye round - included
        ],
      },
    };

    const result = computeRankingFactors(playerId, stats, defaultValues, roundsPlayed);

    // Player's own stats (including bye)
    const total_points = 8 + 3 + 8;
    const total_wins = 1 + 0 + 1;
    const average_points = total_points / roundsPlayed;
    const average_wins = total_wins / roundsPlayed;

    // Opponent stats (excluding games against player1, but including their byes)
    const total_opponent_points = 6 + 8 + 3 + 8;
    const total_opponent_wins = 1 + 1 + 0 + 1;
    const average_opponent_points = total_opponent_points / 2;
    const average_opponent_wins = total_opponent_wins / 2;

    expect(result).toEqual({
      average_opponent_points,
      average_opponent_wins,
      average_points,
      average_wins,
      total_opponent_points,
      total_opponent_wins,
      total_points,
      total_wins,
    });
  });

  it('should work with custom stat keys.', () => {
    type CustomBaseStats = {
      foo: number;
      bar: number;
    };

    const playerId = 'player1' as Id<'tournamentCompetitors'>;
    const opponentId = 'player2' as Id<'tournamentCompetitors'>;

    const defaultValues: CustomBaseStats = {
      foo: 0,
      bar: 0,
    };

    const stats = {
      [playerId]: {
        results: [{ foo: 100, bar: 50, opponentId }],
      },
      [opponentId]: {
        results: [{ foo: 80, bar: 60, opponentId: playerId }],
      },
    };

    const result = computeRankingFactors(playerId, stats, defaultValues, 1);

    expect(result).toEqual({
      average_bar: 50,
      average_foo: 100,
      average_opponent_bar: 0,
      average_opponent_foo: 0,
      total_bar: 50,
      total_foo: 100,
      total_opponent_bar: 0,
      total_opponent_foo: 0,
    });
  });
});
