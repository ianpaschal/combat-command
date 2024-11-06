import {
  MatchResultDeep,
  TournamentCompetitorDeep,
  TournamentDeep,
} from '~/types/db';
import { getCompetitorProfileIds } from '~/utils/common/getCompetitorProfileIds';
  
export type CompetitorResult<T extends (string | number | symbol)> = {
  competitor: TournamentCompetitorDeep;
  result: AggregatorResult<T>;
};

export type AggregatorResult<T extends (string | number | symbol)> = Record<T, number>;

export type Aggregator<T extends (string | number | symbol)> =(
  matches: MatchResultDeep[],
  ownProfileIds: string[],
  opponentProfileIds: string[],
  roundsPlayed: number,
) => AggregatorResult<T>;

/**
 * Aggregates tournament competitor match data, and ranks the competitors according to the ranking factors.
 * 
 * @param tournament 
 * @param matches 
 * @param roundsPlayed 
 * @param rankingFactors 
 * @param aggregator - Function which aggregates a competitor's data so it can be ranked
 * @returns 
 */
export const calculateTournamentRankings = <T extends (string | number | symbol)>(
  tournament: TournamentDeep,
  matches: MatchResultDeep[],
  roundsPlayed: number,
  aggregator: Aggregator<T>,
  rankingFactors: T[],
): CompetitorResult<T>[] => {

  // For each competitor, aggregate their results
  const results = tournament.competitors.reduce((acc, competitor) => {

    // Gather profile IDs for self
    const ownProfileIds = getCompetitorProfileIds(competitor);

    /* Gather opponent IDs via pairings which include this competitor:
     * 1. Gather all pairings which include this competitor
     * 2. For each pairing, pick out the "other" competitor
     * 3. Aggregate profile IDs from those competitors
     */
    const opponentProfileIds = tournament.pairings.filter((pairing) => (
      [pairing.competitor_0_id, pairing.competitor_1_id].includes(competitor.id)
    )).map((pairing) => {
      if (pairing.competitor_0_id === competitor.id) {
        return tournament.competitors.find(
          (competitor) => competitor.id === pairing.competitor_1_id,
        );
      }
      if (pairing.competitor_1_id === competitor.id) {
        return tournament.competitors.find(
          (competitor) => competitor.id === pairing.competitor_0_id,
        );
      }
    }).reduce((acc, competitor) => [
      ...acc,
      ...getCompetitorProfileIds(competitor),
    ], [] as string[]);
  
    return [
      ...acc,
      {
        competitor,
        result: aggregator(matches, ownProfileIds, opponentProfileIds, roundsPlayed),
      },
    ];
  }, [] as CompetitorResult<T>[]);

  // Then sort by the ranking factors
  return results.sort((a, b) => {
    for(const key in rankingFactors){
      const factor = rankingFactors[key];
      if (a.result[factor] > b.result[factor]) {
        return -1;
      }
      if (a.result[factor] < b.result[factor]) {
        return 1;
      }
    }
    return 0; // If all values are equal, maintain original order
  });
};