/**
 * Divides base stats by a given divisor.
 * @param stats
 * @param divisor
 * @returns
 */
export const divideBaseStats = <TStatKey extends string>(
  stats: Record<TStatKey, number>,
  divisor: number,
): Record<TStatKey, number> => Object.keys(stats).reduce((acc, key) => ({
  ...acc,
  [key]: (stats[key as TStatKey] ?? 0) / Math.max(divisor, 1),
}), {} as Record<TStatKey, number>);
