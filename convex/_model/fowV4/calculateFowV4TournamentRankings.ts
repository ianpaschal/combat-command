import { RankingFactor, rankingFactors } from '@ianpaschal/combat-command-static-data/flamesOfWarV4';

import { FowV4TournamentFlatExtendedStats } from './types';

/**
 * Sorts a list of Flames of War 4th Ed. tournament players or competitors by a set of ranking factors.
 * @param list 
 * @param factors 
 * @returns 
 */
export const calculateFowV4TournamentRankings = <T extends { stats: FowV4TournamentFlatExtendedStats }>(
  list: T[],
  factors: RankingFactor[],
): (T & { rank: number })[] => {
  const sorted = [...list].sort((a, b) => {
    for (const factor of factors) {
      const desirability = rankingFactors[factor].desirability;
      const aValue = a.stats[factor];
      const bValue = b.stats[factor];
      if (aValue !== bValue) {
        return desirability === 'higher' ? bValue - aValue : aValue - bValue;
      }
    }
    return 0; // Completely tied
  });
  return sorted.map((item, i) => ({
    ...item,
    rank: i,
  }));
};
