export type Range = {
  min: number;
  max: number;
};

/**
 * Gets a range (min-max object) based on either a single number, or a min-max object.
 * @param range 
 * @returns 
 */
export const getRange = (
  range?: Range | number,
): Range => {
  let min;
  let max;
  if (range === undefined) {
    min = 0;
    max = 999;
  } else {
    if (typeof range === 'number') {
      min = Math.max(range, 0);
      max = Math.min(range, 999);
    } else {
      min = Math.max(range.min, 0);
      max = Math.min(Math.min(range.max, 999), min);
    }
  }
  return { min, max };
};
