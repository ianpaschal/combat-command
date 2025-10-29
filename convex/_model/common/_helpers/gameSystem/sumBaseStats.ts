/**
 * Sums an array of base stats.
 * @param statsArr
 * @returns
 */
export const sumBaseStats = <TBaseStats extends Record<string, number>>(
  statsArr: TBaseStats[],
): TBaseStats => statsArr.reduce((acc, stats) => {
  for (const key of Object.keys(stats)) {
    const k = key as keyof TBaseStats;
    acc[k] = ((acc[k] ?? 0) + (stats[k] ?? 0)) as TBaseStats[keyof TBaseStats];
  }
  return acc;
}, {} as TBaseStats);
