/**
 * Sums an array of base stats.
 * @param statsArr
 * @returns
 */
export const sumBaseStats = <TStatKey extends string>(
  statsArr: Record<TStatKey, number>[],
): Record<TStatKey, number> => statsArr.reduce((acc, stats) => {
  for (const key of Object.keys(stats)) {
    acc[key as TStatKey] = (acc[key as TStatKey] ?? 0) + (stats[key as TStatKey] ?? 0);
  }
  return acc;
}, {} as Record<TStatKey, number>);
