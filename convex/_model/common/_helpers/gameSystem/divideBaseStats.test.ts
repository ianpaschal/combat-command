import {
  describe,
  expect,
  it,
} from 'vitest';

import { BaseStats } from '../../types';
import { divideBaseStats } from './divideBaseStats';

describe('divideBaseStats', () => {
  it('should correctly divide stats when divisor is greater than 0.', () => {
    const data: BaseStats = {
      wins: 2,
      units_destroyed: 9,
      units_lost: 4,
      points: 15,
    };

    const result = divideBaseStats(data, 2);

    expect(result).toEqual({
      wins: 1,
      units_destroyed: 4.5,
      units_lost: 2,
      points: 7.5,
    });
  });

  it('should handle a divisor of 0 by using 1 instead.', () => {
    const data: BaseStats = {
      wins: 2,
      units_destroyed: 9,
      units_lost: 4,
      points: 15,
    };

    const result = divideBaseStats(data, 0);

    expect(result).toEqual({
      wins: 2,
      units_destroyed: 9,
      units_lost: 4,
      points: 15,
    });
  });

  it('should handle undefined values in stats by using 0.', () => {
    const data: BaseStats = {
      wins: 4,
      units_destroyed: undefined as unknown as number,
      units_lost: 2,
      points: 20,
    };

    const result = divideBaseStats(data, 2);

    expect(result).toEqual({
      wins: 2,
      units_destroyed: 0,
      units_lost: 1,
      points: 10,
    });
  });
});
