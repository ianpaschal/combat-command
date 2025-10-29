import { ExtendedRankingFactor } from '@ianpaschal/combat-command-game-systems/common';

import { divideBaseStats } from './divideBaseStats';
import { sumBaseStats } from './sumBaseStats';

export type PlayerBaseStats<TBaseStats extends Record<string, number>> = {
  self: TBaseStats[];
  opponent: TBaseStats[];
};

export const computeRankingFactors = <TBaseStats extends Record<string, number>>(
  baseStats: PlayerBaseStats<TBaseStats>,
  gamesPlayed: number,
  defaultValues: TBaseStats,
): Record<ExtendedRankingFactor<keyof TBaseStats & string>, number> => {

  type FlatStatsKey = ExtendedRankingFactor<keyof TBaseStats & string>;

  const total = sumBaseStats(baseStats.self);
  const total_opponent = sumBaseStats(baseStats.opponent);
  const average = divideBaseStats(total, gamesPlayed);
  const average_opponent = divideBaseStats(total_opponent, gamesPlayed);

  const flatStats: Record<FlatStatsKey, number> = {} as Record<FlatStatsKey, number>;

  Object.keys(defaultValues).forEach((key) => {
    const k = key as keyof TBaseStats;
    flatStats[`total_${key}` as FlatStatsKey] = total[k] ?? defaultValues[k];
    flatStats[`total_opponent_${key}` as FlatStatsKey] = total_opponent[k] ?? defaultValues[k];
    flatStats[`average_${key}` as FlatStatsKey] = average[k] ?? defaultValues[k];
    flatStats[`average_opponent_${key}` as FlatStatsKey] = average_opponent[k] ?? defaultValues[k];
  });

  return flatStats;
};
