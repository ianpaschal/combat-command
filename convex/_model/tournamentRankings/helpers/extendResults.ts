import { Id } from '../../../_generated/dataModel';
import { AggregateTournamentResult, ResultData } from '../types';
import { averageResults } from './averageResults';
import { sumResults } from './sumResults';

export function extendResults<T extends Id<'users'> | Id<'tournamentCompetitors'>>(
  rawResults: Record<T, (ResultData & { opponentId: T })[]>,
  matchesPerRound: number,
) {
  const extendedResults = {} as AggregateTournamentResult<T>;

  /**
   * Because the strength of schedule (average opponents') values require each opponents own totals
   * and averages, we use two loops. The first one calculates every competitor's own results, while
   * the second loop uses those results to add the strength of schedule data.
   */

  // Calculate each competitor's totals and averages per round
  Object.keys(rawResults).forEach((id) => {
    const results = rawResults![id as T];
    const total = sumResults(results);
    const partialRoundsPlayed = Math.min(results.length, matchesPerRound) / matchesPerRound;
    const average = averageResults(total, partialRoundsPlayed);
    const opponentIds = Array.from(new Set(results.map((result) => result.opponentId)));
    // console.log(opponentIds);
    extendedResults[id as T] = {
      opponentIds,
      total,
      average,
      averageOpponent: {
        wins: 0,
        points: 0,
        unitsDestroyed: 0,
        unitsLost: 0,
      },
    };
  });

  // Calculate each competitor's average opponent averages per round (strength of schedule)
  Object.keys(rawResults).forEach((id) => {
    const results = extendedResults[id as T];
    const individualOpponentAverages = results.opponentIds.map(
      (id) => extendedResults[id].average,
    );
    extendedResults[id as T] = {
      ...results,
      averageOpponent: averageResults(
        sumResults(individualOpponentAverages),
        results.opponentIds.length,
      ),
    };
  });

  return extendedResults;
}
