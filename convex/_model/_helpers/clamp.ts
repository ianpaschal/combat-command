/**
 * Clamps a number between two (upper and lower) bounds.
 * 
 * @param input - Number to clamp
 * @param bounds - Tuple of upper and lower bounds 
 * @returns A clamped number
 */
export const clamp = (
  input: number, [lowerBound, upperBound]: [number, number],
): number => (
  Math.min(Math.max(input, lowerBound), upperBound)
);
