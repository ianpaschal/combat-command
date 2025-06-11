export const intersectArrays = <T>(
  arr1: T[],
  arr2: T[],
): T[] => arr1.filter((v) => arr2.includes(v));
