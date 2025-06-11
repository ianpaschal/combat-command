import {
  describe,
  expect,
  it,
} from 'vitest';

import { clamp } from './clamp';

describe('clamp', () => {
  it('should return the input if it is within the bounds.', () => {
    expect(clamp(5, [0, 10])).toBe(5);
    expect(clamp(0, [0, 10])).toBe(0);
    expect(clamp(10, [0, 10])).toBe(10);
  });

  it('should return the lower bound if the input is less than the lower bound.', () => {
    expect(clamp(-5, [0, 10])).toBe(0);
    expect(clamp(-100, [0, 10])).toBe(0);
  });

  it('should return the upper bound if the input is greater than the upper bound.', () => {
    expect(clamp(15, [0, 10])).toBe(10);
    expect(clamp(100, [0, 10])).toBe(10);
  });

  it('should handle negative bounds correctly.', () => {
    expect(clamp(-5, [-10, 0])).toBe(-5);
    expect(clamp(-15, [-10, 0])).toBe(-10);
    expect(clamp(5, [-10, 0])).toBe(0);
  });

  it('should handle bounds where lower and upper are the same.', () => {
    expect(clamp(5, [5, 5])).toBe(5);
    expect(clamp(0, [5, 5])).toBe(5);
    expect(clamp(10, [5, 5])).toBe(5);
  });
});
