import {
  describe,
  expect,
  it,
} from 'vitest';

import { computeRankingFactors, ComputeRankingFactorsData } from './computeRankingFactors';

describe('computeRankingFactors', () => {
  type BaseStats = {
    points: number;
    wins: number;
  };

  const defaultValues: BaseStats = {
    points: 0,
    wins: 0,
  };

  it('should return empty object when baseStats arrays are empty.', () => {
    const data: ComputeRankingFactorsData<BaseStats> = {
      baseStats: {
        self: [],
        opponent: [],
      },
      gamesPlayed: 0,
    };

    const result = computeRankingFactors(data, defaultValues);

    expect(result).toEqual({
      total_points: 0,
      total_wins: 0,
      total_opponent_points: 0,
      total_opponent_wins: 0,
      average_points: 0,
      average_wins: 0,
      average_opponent_points: 0,
      average_opponent_wins: 0,
    });
  });

  it('should compute ranking factors for single game with basic stats.', () => {
    const data: ComputeRankingFactorsData<BaseStats> = {
      gamesPlayed: 1,
      baseStats: {
        self: [{ points: 8, wins: 1 }],
        opponent: [{ points: 1, wins: 0 }],
      },
    };

    const result = computeRankingFactors(data, defaultValues);

    expect(result).toEqual({
      total_points: 8,
      total_wins: 1,
      total_opponent_points: 1,
      total_opponent_wins: 0,
      average_points: 8,
      average_wins: 1,
      average_opponent_points: 1,
      average_opponent_wins: 0,
    });
  });

  it('should compute ranking factors for multiple games.', () => {
    const data: ComputeRankingFactorsData<BaseStats> = {
      gamesPlayed: 3,
      baseStats: {
        self: [
          { points: 8, wins: 1 },
          { points: 6, wins: 1 },
          { points: 3, wins: 0 },
        ],
        opponent: [
          { points: 1, wins: 0 },
          { points: 3, wins: 0 },
          { points: 6, wins: 1 },
        ],
      },
    };

    const result = computeRankingFactors(data, defaultValues);

    expect(result).toEqual({
      average_opponent_points: (1 + 3 + 6) / 3,
      average_opponent_wins: (0 + 0 + 1) / 3,
      average_points: (8 + 6 + 3) / 3,
      average_wins: (1 + 1 + 0) / 3,
      total_opponent_points: 1 + 3 + 6,
      total_opponent_wins: 0 + 0 + 1,
      total_points: 8 + 6 + 3,
      total_wins: 1 + 1 + 0,
    });
  });

  it('should work with custom stat keys.', () => {
    type CustomBaseStats = {
      foo: number;
      bar: number;
    };

    const data: ComputeRankingFactorsData<CustomBaseStats> = {
      gamesPlayed: 1,
      baseStats: {
        self: [{ foo: 100, bar: 50 }],
        opponent: [{ foo: 80, bar: 60 }],
      },
    };

    const defaultValues: CustomBaseStats = {
      foo: 0,
      bar: 0,
    };

    const result = computeRankingFactors(data, defaultValues);

    expect(result).toEqual({
      average_bar: 50,
      average_foo: 100,
      average_opponent_bar: 60,
      average_opponent_foo: 80,
      total_bar: 50,
      total_foo: 100,
      total_opponent_bar: 60,
      total_opponent_foo: 80,
    });
  });

  // FIXME: This test is basically identical to the one above.
  it.skip('should return object with correct key structure for ExtendedRankingFactor type.', () => {
    const data: ComputeRankingFactorsData<BaseStats> = {
      gamesPlayed: 1,
      baseStats: {
        self: [{ points: 10, wins: 1 }],
        opponent: [{ points: 8, wins: 0 }],
      },
    };

    const result = computeRankingFactors(data, defaultValues);

    // Verify all expected key patterns are present
    expect(result).toHaveProperty('total_points');
    expect(result).toHaveProperty('total_wins');
    expect(result).toHaveProperty('total_opponent_points');
    expect(result).toHaveProperty('total_opponent_wins');
    expect(result).toHaveProperty('average_points');
    expect(result).toHaveProperty('average_wins');
    expect(result).toHaveProperty('average_opponent_points');
    expect(result).toHaveProperty('average_opponent_wins');

    // Verify all values are numbers
    Object.values(result).forEach((value) => {
      expect(typeof value).toBe('number');
    });
  });
});
