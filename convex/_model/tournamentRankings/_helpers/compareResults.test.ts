import {
  describe,
  expect,
  it,
} from 'vitest';

import { FowV4RankingFactor } from '../../../static/fowV4/fowV4RankingFactors';
import { AllowedIds,ExtendedResultData } from '../types';
import { compareResults } from './compareResults';

describe('compareResults', () => {
  const mockResultA: ExtendedResultData<AllowedIds> = {
    total: { points: 10, unitsDestroyed: 20, unitsLost: 5, wins: 3 },
    average: { points: 5, unitsDestroyed: 10, unitsLost: 2.5, wins: 1.5 },
    averageOpponent: { points: 4, unitsDestroyed: 8, unitsLost: 3, wins: 1 },
    opponentIds: [], // Not used
    playedTables: [],
    byeRounds: [],
  };

  const mockResultB: ExtendedResultData<AllowedIds> = {
    total: { points: 15, unitsDestroyed: 15, unitsLost: 10, wins: 4 },
    average: { points: 7.5, unitsDestroyed: 7.5, unitsLost: 5, wins: 2 },
    averageOpponent: { points: 6, unitsDestroyed: 9, unitsLost: 2, wins: 1.5 },
    opponentIds: [], // Not used
    playedTables: [],
    byeRounds: [],
  };

  it('should prioritize total_points when rankingFactors includes it', () => {
    const rankingFactors: FowV4RankingFactor[] = ['total_points'];
    const result = compareResults(mockResultA, mockResultB, rankingFactors);
    expect(result).toBe(1); // B has more total points than A
  });

  it('should prioritize total_units_destroyed when rankingFactors includes it', () => {
    const rankingFactors: FowV4RankingFactor[] = ['total_units_destroyed'];
    const result = compareResults(mockResultA, mockResultB, rankingFactors);
    expect(result).toBe(-1); // A has more units destroyed than B
  });

  it('should prioritize total_units_lost in reverse order when rankingFactors includes it', () => {
    const rankingFactors: FowV4RankingFactor[] = ['total_units_lost'];
    const result = compareResults(mockResultA, mockResultB, rankingFactors);
    expect(result).toBe(-1); // A has fewer units lost than B
  });

  it('should prioritize total_wins when rankingFactors includes it', () => {
    const rankingFactors: FowV4RankingFactor[] = ['total_wins'];
    const result = compareResults(mockResultA, mockResultB, rankingFactors);
    expect(result).toBe(1); // B has more wins than A
  });

  it('should handle multiple ranking factors in order of priority', () => {
    const rankingFactors: FowV4RankingFactor[] = ['total_points', 'total_units_destroyed'];
    const result = compareResults(mockResultA, mockResultB, rankingFactors);
    expect(result).toBe(1); // B has more total points, so it wins
  });

  it('should return 0 when all ranking factors result in a tie', () => {
    const mockResultC: ExtendedResultData<AllowedIds> = { ...mockResultA };
    const rankingFactors: FowV4RankingFactor[] = ['total_points', 'total_units_destroyed'];
    const result = compareResults(mockResultA, mockResultC, rankingFactors);
    expect(result).toBe(0); // A and C are identical
  });

  it('should prioritize average_points when rankingFactors includes it', () => {
    const rankingFactors: FowV4RankingFactor[] = ['average_points'];
    const result = compareResults(mockResultA, mockResultB, rankingFactors);
    expect(result).toBe(1); // B has higher average points than A
  });

  it('should prioritize average_units_lost in reverse order when rankingFactors includes it', () => {
    const rankingFactors: FowV4RankingFactor[] = ['average_units_lost'];
    const result = compareResults(mockResultA, mockResultB, rankingFactors);
    expect(result).toBe(-1); // A has fewer average units lost than B
  });

  it('should prioritize average_opponent_points when rankingFactors includes it', () => {
    const rankingFactors: FowV4RankingFactor[] = ['average_opponent_points'];
    const result = compareResults(mockResultA, mockResultB, rankingFactors);
    expect(result).toBe(1); // B has higher average opponent points than A
  });

  it('should return 0 when rankingFactors is empty', () => {
    const rankingFactors: FowV4RankingFactor[] = [];
    const result = compareResults(mockResultA, mockResultB, rankingFactors);
    expect(result).toBe(0); // No factors to compare, so they are tied
  });
});
