import { Infer } from 'convex/values';

import { rankingFactor } from '../../common/rankingFactor';
import { RankingFactorValues, ScoreAdjustment } from '../../common/types';

export const applyScoreAdjustments = (
  rankingFactors: RankingFactorValues,
  adjustments: ScoreAdjustment[],
  lastRound: number,
): Record<Infer<typeof rankingFactor>, number> => {
  const adjusted = { ...rankingFactors };
  for (const adjustment of adjustments) {
    const { rankingFactor, amount, round } = adjustment;
    if (adjusted[rankingFactor] !== undefined && round >= lastRound) {
      adjusted[rankingFactor] = (adjusted[rankingFactor] ?? 0) + amount;
    }
  }
  return adjusted;
};
