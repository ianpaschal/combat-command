import { fowV4StatKeys } from '../../static/fowV4/fowV4RankingFactors';
import { FowV4BaseStats } from './types';

/**
 * Sums an array of Flames of War 4th Ed. base stats.
 * @param statsArr
 * @returns
 */
export const sumFowV4BaseStats = (statsArr: FowV4BaseStats[]): FowV4BaseStats => {
  // If the stats array is empty, we still should return a base stats object filled with 0's
  const defaultValues: FowV4BaseStats = {
    wins: 0,
    units_destroyed: 0,
    units_lost: 0,
    points: 0,
  };
  return statsArr.reduce((acc, stats) => {
    for (const key of fowV4StatKeys) {
      acc[key] = (acc[key] ?? 0) + (stats[key] ?? 0);
    }
    return acc;
  }, defaultValues);
};
