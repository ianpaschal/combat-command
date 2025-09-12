import { getRankingFactorDisplayName } from '@ianpaschal/combat-command-static-data/flamesOfWarV4';

import { ScoreAdjustmentFormData } from './ScoreAdjustmentFormItem.schema';

export const formatScoreAdjustment = (scoreAdjustment: ScoreAdjustmentFormData, useTeams?: boolean): string => {
  const rankingFactorDisplayName = getRankingFactorDisplayName(scoreAdjustment.rankingFactor);
  const operation = (scoreAdjustment.amount ?? 0) > 0 ? 'added to' : 'removed from';
  return `This ${useTeams ? 'team' : 'player'} will have ${Math.abs(scoreAdjustment?.amount ?? 0)} ${operation} their ${rankingFactorDisplayName?.full ?? ''} for round ${scoreAdjustment.round + 1}.`;
};
