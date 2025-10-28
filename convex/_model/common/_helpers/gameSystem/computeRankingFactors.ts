import { ExtendedRankingFactor } from '@ianpaschal/combat-command-game-systems/common';

import { AnyBaseStats, TournamentPlayerMetadata } from '../../types';
import { divideBaseStats } from './divideBaseStats';
import { sumBaseStats } from './sumBaseStats';

export type ComputeRankingFactorsData<TBaseStats extends AnyBaseStats> = Pick<TournamentPlayerMetadata<TBaseStats>, 'baseStats'|'gamesPlayed'>;

export const computeRankingFactors = <TBaseStats extends AnyBaseStats>(
  data: ComputeRankingFactorsData<TBaseStats>,
  defaultValues: TBaseStats,
): Record<ExtendedRankingFactor<keyof TBaseStats & string>, number> => {

  type FlatStatsKey = ExtendedRankingFactor<keyof TBaseStats & string>;

  const total = sumBaseStats(data.baseStats.self);
  const total_opponent = sumBaseStats(data.baseStats.opponent);
  const average = divideBaseStats(total, data.gamesPlayed);
  const average_opponent = divideBaseStats(total_opponent, data.gamesPlayed);

  const flatStats: Record<FlatStatsKey, number> = {} as Record<FlatStatsKey, number>;

  Object.keys(defaultValues).forEach((key) => {
    flatStats[`total_${key}` as FlatStatsKey] = total[key] ?? defaultValues[key];
    flatStats[`total_opponent_${key}` as FlatStatsKey] = total_opponent[key] ?? defaultValues[key];
    flatStats[`average_${key}` as FlatStatsKey] = average[key] ?? defaultValues[key];
    flatStats[`average_opponent_${key}` as FlatStatsKey] = average_opponent[key] ?? defaultValues[key];
  });

  return flatStats;
};
