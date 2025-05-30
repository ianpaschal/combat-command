import {
  describe,
  expect,
  it,
} from 'vitest';

import { ResultData } from '../types';
import { averageResults } from './averageResults';

describe('averageResults', () => {

  const results: ResultData = {
    wins: 1,
    points: 8,
    unitsDestroyed: 12,
    unitsLost: 5,
  };

  it('should correctly average the values with a valid denominator', () => {
    expect(averageResults(results, 2)).toEqual({
      wins: 0.5,
      points: 4,
      unitsDestroyed: 6,
      unitsLost: 2.5,
    });
  });

  it('should throw an error if the denominator is 0', () => {
    expect(() => averageResults(results, 0)).toThrowError();
  });

  // it('should return an empty object if results is empty', () => {
  //   const results: ResultData = {};
  //   const denominator = 2;

  //   expect(averageResults(results, denominator)).toEqual({});
  // });

  // it('should correctly handle a negative denominator', () => {
  
  //   const denominator = -2;
  //   const expected = { a: -5, b: -10, c: -15 };

  //   expect(averageResults(results, denominator)).toEqual(expected);
  // });

  // it('should correctly average mixed positive and negative values', () => {

  //   const denominator = 2;
  //   const expected = { a: 5, b: -10, c: 15 };

  //   expect(averageResults(results, denominator)).toEqual(expected);
  // });
});
