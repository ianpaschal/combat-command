import { ExtendedRankingFactor } from '@ianpaschal/combat-command-game-systems/common';

import { Id } from '../../../../_generated/dataModel';
import { divideBaseStats } from './divideBaseStats';
import { sumBaseStats } from './sumBaseStats';

export const computeRankingFactors = <
  TBaseStats extends Record<string, number>,
  TId extends Id<'tournamentRegistrations'> | Id<'tournamentCompetitors'>,
>(
  id: TId,
  stats: Record<TId, { results: (TBaseStats & { opponentId: TId | null })[] }>,
  defaultValues: TBaseStats,
  roundsPlayed: number,
): Record<ExtendedRankingFactor<keyof TBaseStats & string>, number> => {

  // Own:
  const ownResults = stats[id].results;
  const total = sumBaseStats(ownResults);
  const average = divideBaseStats(total, roundsPlayed);

  // Strength of schedule:
  // Get all opponent IDs (excluding byes (null), so SoS is only based on real competitors):
  const opponentIds = Array.from(new Set(ownResults.map((r) => r.opponentId).filter((id) => id !== null)));
  
  // Get all results for opponents, excluding results against the subject competitor:
  const opponentResultsAgainstOthers = opponentIds.reduce((acc, opponentId) => [
    ...acc,
    ...stats[opponentId].results.filter((stats) => stats.opponentId !== id), // Results against others
  ], [] as (TBaseStats & { opponentId: TId | null })[]);
  const totalOpponent = sumBaseStats(opponentResultsAgainstOthers);
  const averageOpponent = divideBaseStats(totalOpponent, opponentIds.length);

  // Build the stats object:
  type FlatStatsKey = ExtendedRankingFactor<keyof TBaseStats & string>;
  const flatStats: Record<FlatStatsKey, number> = {} as Record<FlatStatsKey, number>;

  Object.keys(defaultValues).forEach((key) => {
    const k = key as keyof TBaseStats;
    // Own:
    flatStats[`total_${key}` as FlatStatsKey] = total[k] ?? defaultValues[k];
    flatStats[`average_${key}` as FlatStatsKey] = average[k] ?? defaultValues[k];

    // Strength of schedule:
    flatStats[`total_opponent_${key}` as FlatStatsKey] = totalOpponent[k] ?? defaultValues[k];
    flatStats[`average_opponent_${key}` as FlatStatsKey] = averageOpponent[k] ?? defaultValues[k];
  });

  return flatStats;
};
