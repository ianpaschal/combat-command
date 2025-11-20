/**
 * Divides base stats by a given divisor.
 * @param stats
 * @param divisor
 * @returns
 */
export const divideBaseStats = <TBaseStats extends Record<string, number>>(
  stats: TBaseStats,
  divisor: number,
): TBaseStats => Object.keys(stats).reduce((acc, key) => ({
  ...acc,
  [key]: (stats[key as keyof TBaseStats] ?? 0) / Math.max(divisor, 1),
}), {} as TBaseStats);
