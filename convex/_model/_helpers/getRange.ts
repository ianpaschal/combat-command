import { clamp } from './clamp';

export type Range = {
  min: number;
  max: number;
};

/**
 * Gets a range (min-max object) based on either a single number, or a min-max object.
 * 
 * @param range - Range or number to clamp
 * @returns A range (min-max) object containing the range clamped to the bounds
 */
export const getRange = (
  range?: Range | number,
): Range => {
  const upperBound = 999;
  const lowerBound = 0;
  let min;
  let max;
  if (range === undefined) {
    min = lowerBound;
    max = upperBound;
  } else {
    if (typeof range === 'number') {
      min = clamp(range, [lowerBound, upperBound]);
      max = clamp(range, [min, upperBound]);
    } else {
      min = clamp(range.min, [lowerBound, upperBound]);
      max = clamp(range.max, [min, upperBound]);
    }
  }
  return { min, max };
};
