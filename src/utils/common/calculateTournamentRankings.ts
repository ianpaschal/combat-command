import { MatchResultRowFilterableRow } from '~/services/matchResults/fetchMatchResultBaseQuery';
import { TournamentCompetitorDeep, TournamentDeep } from '~/types/db';
import { getCompetitorOpponents } from '~/utils/common/getCompetitorOpponents';
import { getCompetitorPlayedTables } from '~/utils/common/getCompetitorPlayedTables';
import { getCompetitorProfileIds } from '~/utils/common/getCompetitorProfileIds';
  
export type CompetitorResult<T extends (string | number | symbol)> = {
  competitor: TournamentCompetitorDeep;
  opponentCompetitorIds: string[];
  result: AggregatorResult<T>;
  playedTables: number[];
};

export type AggregatorResult<T extends (string | number | symbol)> = Record<T, number>;

export type Aggregator<T extends (string | number | symbol)> =(
  matches: MatchResultRowFilterableRow[],
  ownProfileIds: string[],
  opponentProfileIds: string[],
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
  matches: MatchResultRowFilterableRow[],
  aggregator: Aggregator<T>,
): CompetitorResult<T>[] => {

  // For each competitor, aggregate their results
  const results = tournament.competitors.reduce((acc, competitor) => {
    const ownProfileIds = getCompetitorProfileIds(competitor);
    const opponents = getCompetitorOpponents(tournament, competitor.id);
    const opponentProfileIds = getCompetitorOpponents(tournament, competitor.id).reduce((acc, competitor) => [
      ...acc,
      ...getCompetitorProfileIds(competitor),
    ], [] as string[]);
    const playedTables = getCompetitorPlayedTables(tournament, competitor.id);
    return [
      ...acc,
      {
        competitor,
        opponentCompetitorIds: opponents.map((opponent) => opponent.id),
        result: aggregator(matches, ownProfileIds, opponentProfileIds),
        playedTables,
      },
    ];
  }, [] as CompetitorResult<T>[]);

  // Then sort by the ranking factors
  return results.sort((a, b) => {
    for(const key in tournament.ranking_factors){
      const factor = tournament.ranking_factors[key];
      if (a.result[factor as T] > b.result[factor as T]) {
        return -1;
      }
      if (a.result[factor as T] < b.result[factor as T]) {
        return 1;
      }
    }
    return 0; // If all values are equal, maintain original order
  });
};
