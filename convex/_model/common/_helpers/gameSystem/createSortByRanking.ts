import { GameSystem, getGameSystem } from '@ianpaschal/combat-command-game-systems/common';

import { RankingFactor } from '../../types';

export const createSortByRanking = <TRankingFactor extends RankingFactor>(
  gameSystem: GameSystem,
  rankingFactors: TRankingFactor[],
) => {
  const { rankingFactors: rankingFactorsMetadata } = getGameSystem(gameSystem);
  return <T extends { rankingFactors: Record<TRankingFactor, number> }>(a: T, b: T): number => {
    for (const factor of rankingFactors) {
      const desirability = rankingFactorsMetadata[factor].desirability;
      const aValue = a.rankingFactors[factor];
      const bValue = b.rankingFactors[factor];
      if (aValue !== bValue) {
        return desirability === 'higher' ? bValue - aValue : aValue - bValue;
      }
    }
    return 0; // Completely tied
  };
};
