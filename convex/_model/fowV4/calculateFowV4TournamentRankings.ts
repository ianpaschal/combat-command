import { FowV4RankingFactor, fowV4RankingFactorDesirability } from '../../static/fowV4/fowV4RankingFactors';
import { FowV4TournamentFlatExtendedStats } from './types';

/**
 * Sorts a list of Flames of War 4th Ed. tournament players or competitors by a set of ranking factors.
 * @param list 
 * @param rankingFactors 
 * @returns 
 */
export const calculateFowV4TournamentRankings = <T extends { stats: FowV4TournamentFlatExtendedStats }>(
  list: T[],
  rankingFactors: FowV4RankingFactor[],
): (T & { rank: number })[] => {
  const sorted = [...list].sort((a, b) => {
    for (const factor of rankingFactors) {
      const desirability = fowV4RankingFactorDesirability[factor];
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
