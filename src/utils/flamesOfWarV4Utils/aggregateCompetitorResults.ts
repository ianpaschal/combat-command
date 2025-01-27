import { ZodLiteral } from 'zod';

import { MatchDeep } from '~/types/db/Matches';
import { FowV4RankingFactor, fowV4RankingFactorSchema } from '~/types/fowV4/fowV4RankingFactorSchema';
import { AggregatorResult } from '~/utils/common/calculateTournamentRankings';
import { getTotalPointsByProfileId } from './getTotalPointsByProfileId';
import { getTotalUnitsDestroyedByProfileId } from './getTotalUnitsDestroyedByProfileId';
import { getTotalUnitsLostByProfileId } from './getTotalUnitsLostByProfileId';
import { getTotalWinsByProfileId } from './getTotalWinsByProfileId';

// TODO: This could be made more generic if paired with an array of keys and getter fns
export const aggregateCompetitorResults = (
  matches: MatchDeep[],
  ownProfileIds: string[],
  opponentProfileIds: string[],
): AggregatorResult<FowV4RankingFactor> => {

  // Create default object filled with 0's
  const results = fowV4RankingFactorSchema.options.filter(
    (option) => option instanceof ZodLiteral,
  ).reduce((acc, { value: key }) => ({
    ...acc,
    [key]: 0,
  }), {} as AggregatorResult<FowV4RankingFactor>);

  if (!matches.length || !ownProfileIds.length || !opponentProfileIds.length) {
    return results;
  }

  // The logic is basically the same for player in question and opponents, apart from the key
  [
    ...ownProfileIds.map((id) => ({ id, isOpponent: false })),
    ...opponentProfileIds.map((id) => ({ id, isOpponent: true })),
  ].forEach(({ id, isOpponent }) => {

    // TODO: Rounds should be number of rounds played by the player
    // TODO: Opponent results shouldn't include stuff against this player

    const ownMatchResults = matches.filter(
      (match) => [match.player_0.profile.id, match.player_1.profile.id].includes(id),
    );

    // Don't include matches against this competitor:
    const opponentMatchResults = ownMatchResults.filter((match) => {
      const player0BelongsToThisCompetitor = ownProfileIds.includes(match.player_0.profile.id);
      const player1BelongsToThisCompetitor = ownProfileIds.includes(match.player_1.profile.id);
      return !player0BelongsToThisCompetitor && !player1BelongsToThisCompetitor;
    });

    const searchMatches = isOpponent ? opponentMatchResults : ownMatchResults;

    // This assumes that each player only plays 1 round per match...
    const roundsIncluded = Math.max(searchMatches.length, 1);

    const profileResults = {
      wins: getTotalWinsByProfileId(searchMatches, id),
      points: getTotalPointsByProfileId(searchMatches, id),
      units_destroyed: getTotalUnitsDestroyedByProfileId(searchMatches, id),
      units_lost: getTotalUnitsLostByProfileId(searchMatches, id),
    };
    Object.entries(profileResults).forEach(([key, value]) => {
      const totalKey = (isOpponent ? `total_opponent_${key}` : `total_${key}`) as FowV4RankingFactor;
      const avgKey = (isOpponent ? `avg_opponent_${key}` : `avg_${key}`) as FowV4RankingFactor;
      results[totalKey] = results[totalKey] + value;
      results[avgKey] = Number((results[totalKey] / roundsIncluded).toFixed(2));
    });
  });
  return results;
};