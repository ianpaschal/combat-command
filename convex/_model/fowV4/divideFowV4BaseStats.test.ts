import {
  describe,
  expect,
  it,
} from 'vitest';

import { divideFowV4BaseStats } from './divideFowV4BaseStats';
import { FowV4BaseStats } from './types';

describe('divideFowV4BaseStats', () => {
  it('should correctly divide stats when divisor is greater than 0.', () => {
    const totals: FowV4BaseStats = {
      wins: 2,
      units_destroyed: 9,
      units_lost: 4,
      points: 15,
    };
    expect(divideFowV4BaseStats(totals, 2)).toEqual({
      wins: 1,
      units_destroyed: 4.5,
      units_lost: 2,
      points: 7.5,
    });
  });

  it('should handle a divisor of 0 by using 1 instead.', () => {
    const totals: FowV4BaseStats = {
      wins: 2,
      units_destroyed: 9,
      units_lost: 4,
      points: 15,
    };
    expect(divideFowV4BaseStats(totals, 0)).toEqual({
      wins: 2,
      units_destroyed: 9,
      units_lost: 4,
      points: 15,
    });
  });
});
