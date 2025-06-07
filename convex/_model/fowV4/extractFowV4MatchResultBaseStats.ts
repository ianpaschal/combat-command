import { Doc } from '../../_generated/dataModel';
import { calculateFowV4MatchResultScore } from './calculateFowV4MatchResultScore';
import { FowV4BaseStats } from './types';

/**
 * Extracts FowV4TournamentBaseStats from a Flames of War v4 matchResult.
 * @param matchResult
 * @param userId
 * @returns
 */

export const extractFowV4MatchResultBaseStats = (matchResult: Doc<'matchResults'>): [FowV4BaseStats, FowV4BaseStats] => {
  const score = calculateFowV4MatchResultScore(matchResult);
  return [
    {
      points: score[0],
      units_destroyed: matchResult.details.player1UnitsLost,
      units_lost: matchResult.details.player0UnitsLost,
      wins: matchResult.details.winner === 0 ? 1 : 0,
    },
    {
      points: score[1],
      units_destroyed: matchResult.details.player0UnitsLost,
      units_lost: matchResult.details.player1UnitsLost,
      wins: matchResult.details.winner === 1 ? 1 : 0,
    },
  ];
};
