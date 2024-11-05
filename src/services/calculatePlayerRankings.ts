import { ZodLiteral } from 'zod';

import { getMatches } from '~/services/matchResults/getMatchesByTournamentId';
import { fetchTournamentFull } from '~/services/tournaments/fetchTournamentFull';
import { MatchResultDeep, TournamentCompetitorDeep } from '~/types/db';
import { FowV4RankingFactor, fowV4RankingFactorSchema } from '~/types/fowV4/fowV4RankingFactorSchema';
import flamesOfWarV4Utils from '~/utils/flamesOfWarV4Utils';

export type AggregateResult = Record<FowV4RankingFactor, number>;
export type AggregateCompetitorResult = AggregateResult & {
  competitor: TournamentCompetitorDeep;
};

const aggregatePlayerResults = (
  matchResults: MatchResultDeep[],
  ownProfileIds: string[],
  opponentProfileIds: string[],
  rounds: number,
): AggregateResult => {

  // Create default object filled with 0's
  const results = fowV4RankingFactorSchema.options.filter(
    (option) => option instanceof ZodLiteral,
  ).reduce((acc, { value: key }) => ({
    ...acc,
    [key]: 0,
  }), {} as AggregateResult);

  // The logic is basically the same for player in question and opponents, apart from the key
  [
    ...ownProfileIds.map((id) => ({ id, isOpponent: false })),
    ...opponentProfileIds.map((id) => ({ id, isOpponent: true })),
  ].forEach(({ id, isOpponent }) => {
    const profileResults = {
      wins: flamesOfWarV4Utils.getTotalWinsByProfileId(matchResults, id),
      points: flamesOfWarV4Utils.getTotalPointsByProfileId(matchResults, id),
      units_destroyed: flamesOfWarV4Utils.getTotalUnitsDestroyedByProfileId(matchResults, id),
      units_lost: flamesOfWarV4Utils.getTotalUnitsLostByProfileId(matchResults, id),
    };
    Object.entries(profileResults).forEach(([key, value]) => {
      const totalKey = (isOpponent ? `total_opponent_${key}` : `total_${key}`) as keyof AggregateResult;
      const avgKey = (isOpponent ? `avg_opponent_${key}` : `total_${key}`) as keyof AggregateResult;
      results[totalKey] = results[totalKey] + value;
      results[avgKey] = results[totalKey] / rounds;
    });
  });
  return results;
};

const getCompetitorPlayerIds = (competitor?: TournamentCompetitorDeep) => {
  if (!competitor) {
    return [];
  }
  return competitor.players.map((player) => player.profile.id);
};
  
export const getFullTournamentResults = async (
  tournamentId: string,
  rounds?: number,
): Promise<AggregateCompetitorResult[]> => {
  const tournament = await fetchTournamentFull(tournamentId);
  const matches = await getMatches();

  // If no round count is provided, use the full number of rounds
  const roundCount = rounds || tournament.round_count;

  // For each competitor, aggregate their results
  return tournament.competitors.reduce((acc, competitor) => {

    // Gather profile IDs for self
    const ownProfileIds = getCompetitorPlayerIds(competitor);

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
      ...getCompetitorPlayerIds(competitor),
    ], [] as string[]);
  
    return [
      ...acc,
      {
        competitor,
        ...aggregatePlayerResults(matches, ownProfileIds, opponentProfileIds, roundCount),
      },
    ];
  }, [] as AggregateCompetitorResult[]);
};