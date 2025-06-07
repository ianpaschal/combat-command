import { FowV4RankingFactor } from '../../../static/fowV4/fowV4RankingFactors';
import { AllowedIds,ExtendedResultData } from '../types';

export function compareResults(
  a: ExtendedResultData<AllowedIds>,
  b: ExtendedResultData<AllowedIds>,
  rankingFactors: FowV4RankingFactor[],
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const factorMap: Record<FowV4RankingFactor, (a: ExtendedResultData<AllowedIds>, b: ExtendedResultData<AllowedIds>) => number> = {
    total_points: (a, b) => b.total.points - a.total.points,
    total_units_destroyed: (a, b) => b.total.unitsDestroyed - a.total.unitsDestroyed,
    total_units_lost: (a, b) => a.total.unitsLost - b.total.unitsLost, // Reverse order
    total_wins: (a, b) => b.total.wins - a.total.wins,
    average_points: (a, b) => b.average.points - a.average.points,
    average_units_destroyed: (a, b) => b.average.unitsDestroyed - a.average.unitsDestroyed,
    average_units_lost: (a, b) => a.average.unitsLost - b.average.unitsLost, // Reverse order
    average_wins: (a, b) => b.average.wins - a.average.wins,
    average_opponent_points: (a, b) => b.averageOpponent.points - a.averageOpponent.points,
    average_opponent_units_destroyed: (a, b) => b.averageOpponent.unitsDestroyed - a.averageOpponent.unitsDestroyed,
    average_opponent_units_lost: (a, b) => a.averageOpponent.unitsLost - b.averageOpponent.unitsLost, // Reverse order
    average_opponent_wins: (a, b) => b.averageOpponent.wins - a.averageOpponent.wins,
  };
  
  for (const factor of rankingFactors) {
    if (factorMap[factor]) {
      const result = factorMap[factor](a, b);
      if (result !== 0) return Math.sign(result);
    }
  }

  return 0; // They are completely tied
}
