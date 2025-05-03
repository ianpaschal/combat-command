import {
  describe,
  expect,
  it,
} from 'vitest';

import { notNullOrUndefined } from './notNullOrUndefined';

describe('notNullOrUndefined', () => {
  it('should return true for non-null and non-undefined values', () => {
    expect(notNullOrUndefined(42)).toBe(true);
    expect(notNullOrUndefined('hello')).toBe(true);
    expect(notNullOrUndefined(true)).toBe(true);
    expect(notNullOrUndefined({})).toBe(true);
    expect(notNullOrUndefined([])).toBe(true);
  });

  it('should return false for null values', () => {
    expect(notNullOrUndefined(null)).toBe(false);
  });

  it('should return false for undefined values', () => {
    expect(notNullOrUndefined(undefined)).toBe(false);
  });

  it('should work with type narrowing', () => {
    const values: (number | null | undefined)[] = [1, null, undefined, 2];
    const filteredValues = values.filter(notNullOrUndefined);
    expect(filteredValues).toEqual([1, 2]); // Only non-null and non-undefined values should remain
  });
});
