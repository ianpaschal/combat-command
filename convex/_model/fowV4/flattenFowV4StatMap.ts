import { RankingFactorGroup, StatKey } from '@ianpaschal/combat-command-static-data/flamesOfWarV4';

import {
  FowV4StatId,
  FowV4TournamentExtendedStats,
  FowV4TournamentFlatExtendedStats,
} from './types';

/**
 *
 * @param statMap
 * @returns
 */

export const flattenFowV4StatMap = <T extends FowV4StatId>(
  statMap: Record<T, FowV4TournamentExtendedStats>,
): { id: T; stats: FowV4TournamentFlatExtendedStats, gamesPlayed: number }[] => {
  const statList = Object.entries(statMap) as [T, FowV4TournamentExtendedStats][];
  return statList.map(([key, stats]) => {
    const flatStats = {} as FowV4TournamentFlatExtendedStats;
    for (const prefix of Object.values(RankingFactorGroup)) {
      const statGroup = stats[prefix];
      for (const statKey of Object.values(StatKey)) {
        const flatKey = `${prefix}_${statKey}` as keyof FowV4TournamentFlatExtendedStats;
        flatStats[flatKey] = statGroup[statKey];
      }
    }
    return {
      id: key,
      stats: flatStats,
      gamesPlayed: stats.gamesPlayed ?? 0,
    };
  });
};
