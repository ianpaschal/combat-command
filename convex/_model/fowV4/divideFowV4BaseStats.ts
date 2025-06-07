import { fowV4StatKeys } from '../../static/fowV4/fowV4RankingFactors';
import { FowV4BaseStats } from './types';

/**
 * Divides Flames of War 4th Ed. base stats by a given divisor.
 * @param stats
 * @param divisor
 * @returns
 */
export const divideFowV4BaseStats = (stats: FowV4BaseStats, divisor: number): FowV4BaseStats => {
  const averagedStats: FowV4BaseStats = {
    wins: 0,
    units_destroyed: 0,
    units_lost: 0,
    points: 0,
  };
  for (const key of fowV4StatKeys) {
    averagedStats[key] = (stats[key] ?? 0) / Math.max(divisor, 1);
  }
  return averagedStats;
};
