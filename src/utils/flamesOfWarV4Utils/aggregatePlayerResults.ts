import { ZodLiteral } from 'zod';

import { MatchResultDeep } from '~/types/db';
import { FowV4RankingFactor, fowV4RankingFactorSchema } from '~/types/fowV4/fowV4RankingFactorSchema';
import { AggregatorResult } from '~/utils/common/calculateTournamentRankings';
import { getTotalPointsByProfileId } from './getTotalPointsByProfileId';
import { getTotalUnitsDestroyedByProfileId } from './getTotalUnitsDestroyedByProfileId';
import { getTotalUnitsLostByProfileId } from './getTotalUnitsLostByProfileId';
import { getTotalWinsByProfileId } from './getTotalWinsByProfileId';

// TODO: This could be made more generic if paired with an array of keys and getter fns
export const aggregatePlayerResults = (
  matchResults: MatchResultDeep[],
  ownProfileIds: string[],
  opponentProfileIds: string[],
  rounds: number,
): AggregatorResult<FowV4RankingFactor> => {

  // Create default object filled with 0's
  const results = fowV4RankingFactorSchema.options.filter(
    (option) => option instanceof ZodLiteral,
  ).reduce((acc, { value: key }) => ({
    ...acc,
    [key]: 0,
  }), {} as AggregatorResult<FowV4RankingFactor>);

  // The logic is basically the same for player in question and opponents, apart from the key
  [
    ...ownProfileIds.map((id) => ({ id, isOpponent: false })),
    ...opponentProfileIds.map((id) => ({ id, isOpponent: true })),
  ].forEach(({ id, isOpponent }) => {
    const profileResults = {
      wins: getTotalWinsByProfileId(matchResults, id),
      points: getTotalPointsByProfileId(matchResults, id),
      units_destroyed: getTotalUnitsDestroyedByProfileId(matchResults, id),
      units_lost: getTotalUnitsLostByProfileId(matchResults, id),
    };
    Object.entries(profileResults).forEach(([key, value]) => {
      const totalKey = (isOpponent ? `total_opponent_${key}` : `total_${key}`) as FowV4RankingFactor;
      const avgKey = (isOpponent ? `avg_opponent_${key}` : `total_${key}`) as FowV4RankingFactor;
      results[totalKey] = results[totalKey] + value;
      results[avgKey] = results[totalKey] / rounds;
    });
  });
  return results;
};