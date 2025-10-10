import { GameSystem, getGameSystem } from '@ianpaschal/combat-command-game-systems/common';

import { ScoreAdjustmentFormData } from './ScoreAdjustmentFormItem.schema';

export const formatScoreAdjustment = (gameSystem: GameSystem, scoreAdjustment: ScoreAdjustmentFormData, useTeams?: boolean): string => {
  const { getRankingFactorDisplayName } = getGameSystem(gameSystem);
  const rankingFactorDisplayName = getRankingFactorDisplayName(scoreAdjustment.rankingFactor);
  const operation = (scoreAdjustment.amount ?? 0) > 0 ? 'added to' : 'removed from';
  return `This ${useTeams ? 'team' : 'player'} will have ${Math.abs(scoreAdjustment?.amount ?? 0)} ${operation} their ${rankingFactorDisplayName ?? '[Unknown Factor]'} for round ${scoreAdjustment.round + 1}.`;
};
