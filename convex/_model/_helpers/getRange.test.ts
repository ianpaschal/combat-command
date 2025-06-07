import {
  describe,
  expect,
  it,
} from 'vitest';

import { getRange } from './getRange';

describe('getRange', () => {
  it('should return default range when input is undefined.', () => {
    expect(getRange()).toEqual({ min: 0, max: 999 });
  });

  it('should return a range clamped between 0 and 999 when input is a number.', () => {
    expect(getRange(500)).toEqual({ min: 500, max: 500 });
    expect(getRange(-50)).toEqual({ min: 0, max: 0 });
    expect(getRange(1500)).toEqual({ min: 999, max: 999 });
  });

  it('should return a valid range when input is a Range object.', () => {
    expect({ min: 100, max: 200 }).toEqual({ min: 100, max: 200 });
  });

  it('should clamp min and max values within valid bounds when input is a Range object.', () => {
    expect({ min: -50, max: 200 }).toEqual({ min: 0, max: 200 });
    expect({ min: 100, max: 1500 }).toEqual({ min: 100, max: 999 });
    expect({ min: 500, max: 400 }).toEqual({ min: 500, max: 500 });
  });
});
