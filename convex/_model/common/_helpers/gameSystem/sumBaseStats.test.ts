import {
  describe,
  expect,
  it,
} from 'vitest';

import { AnyBaseStats } from '../../types';
import { sumBaseStats } from './sumBaseStats';

describe('sumBaseStats', () => {
  it('should correctly sum stats from an array of base stats objects.', () => {
    const statsArr: AnyBaseStats[] = [
      { attr_0: 2, attr_1: 5 },
      { attr_0: 1, attr_1: 4 },
      { attr_0: 3, attr_1: 6 },
    ];

    const result = sumBaseStats(statsArr);

    expect(result).toEqual({
      attr_0: 6,
      attr_1: 15,
    });
  });

  it('should handle an empty array by returning an empty object.', () => {
    const statsArr: AnyBaseStats[] = [];

    const result = sumBaseStats(statsArr);

    expect(result).toEqual({});
  });

  it('should handle objects with different keys by including all unique keys.', () => {
    const statsArr: AnyBaseStats[] = [
      { attr_0: 2, attr_1: 5 },
      { attr_0: 1, attr_2: 3 },
      { attr_1: 4, attr_2: 2 },
    ];

    const result = sumBaseStats(statsArr);

    expect(result).toEqual({
      attr_0: 3,
      attr_1: 9,
      attr_2: 5,
    });
  });
});
