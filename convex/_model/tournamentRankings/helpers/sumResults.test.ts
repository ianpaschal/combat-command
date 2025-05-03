import {
  describe,
  expect,
  it,
} from 'vitest';

import { ResultData } from '../types';
import { sumResults } from './sumResults';

describe('sumResults', () => {

  const results: ResultData[] = [
    {
      wins: 1,
      points: 8,
      unitsDestroyed: 7,
      unitsLost: 2,
    },
    {
      wins: 0,
      points: 2,
      unitsDestroyed: 3,
      unitsLost: 5,
    },
    {
      wins: 1,
      points: 6,
      unitsDestroyed: 4,
      unitsLost: 2,
    },
  ];

  it('should correctly sum the values', () => {
    expect(sumResults(results)).toEqual({
      wins: 2,
      points: 16,
      unitsDestroyed: 14,
      unitsLost: 9,
    });
  });
});
