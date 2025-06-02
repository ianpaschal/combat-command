import { fowV4RankingFactorGroups, fowV4StatKeys } from '../../static/fowV4/fowV4RankingFactors';
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
): { id: T; stats: FowV4TournamentFlatExtendedStats }[] => {
  const statList = Object.entries(statMap) as [T, FowV4TournamentExtendedStats][];
  return statList.map(([key, stats]) => {
    const flatStats = {} as FowV4TournamentFlatExtendedStats;
    for (const prefix of fowV4RankingFactorGroups) {
      const statGroup = stats[prefix];
      for (const statKey of fowV4StatKeys) {
        const flatKey = `${prefix}_${statKey}` as keyof FowV4TournamentFlatExtendedStats;
        flatStats[flatKey] = statGroup[statKey];
      }
    }
    return {
      id: key,
      stats: flatStats,
    };
  });
};
