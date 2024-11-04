import { ZodLiteral } from 'zod';

import { fetchTournamentFull } from '~/services/tournaments/fetchTournamentFull';
import { FowV4RankingFactor, fowV4RankingFactorSchema } from '~/types/fowV4/fowV4RankingFactorSchema';
import { Match } from '~/types/Match';
import { TournamentCompetitor } from '~/types/TournamentCompetitor';
import { TournamentPlayer } from '~/types/TournamentPlayer';
import flamesOfWarV4Utils from '~/utils/flamesOfWarV4Utils';

export type AggregatedPlayerResults = Record<FowV4RankingFactor, number>;

const aggregatePlayerResults = (matchResults: Match[], userId: string): AggregatedPlayerResults => {

  // Create default object filled with 0's
  const results = fowV4RankingFactorSchema.options.filter(
    (option) => option instanceof ZodLiteral,
  ).reduce((acc, { value: key }) => ({
    ...acc,
    [key]: 0,
  }), {} as AggregatedPlayerResults);
    
  const opponentIds = flamesOfWarV4Utils.getOpponentUserIdsByUser(matchResults, userId);
  const rounds = opponentIds.length;

  // The logic is basically the same for player in question and opponents, apart from the key
  [...opponentIds, userId].forEach((id) => {
    const playerResults = {
      wins: flamesOfWarV4Utils.getTotalWinsByUser(matchResults, id),
      points: flamesOfWarV4Utils.getTotalPointsByUser(matchResults, id),
      units_destroyed: flamesOfWarV4Utils.getTotalUnitsDestroyedByUser(matchResults, id),
      units_lost: flamesOfWarV4Utils.getTotalUnitsLostByUser(matchResults, id),
    };
    Object.entries(playerResults).forEach(([key, value]) => {
      const totalKey = (id === userId ? `total_${key}` : `total_opponent_${key}`) as keyof AggregatedPlayerResults;
      const avgKey = (id === userId ? `avg_${key}` : `avg_opponent_${key}`) as keyof AggregatedPlayerResults;
      results[totalKey] = results[totalKey] + value;
      results[avgKey] = results[totalKey] / rounds;
    });
  });

  return results;
};

const getFullTournamentResults = async (tournamentId: string, rounds?: number) => {

  const tournament = await fetchTournamentFull(tournamentId);

  // If no round count is provided, use the full number of rounds.
  const roundCount = rounds || tournament.round_count;

  // For each competitor:
  tournament.competitors.forEach((competitor) => {
    const ownUserIds = competitor.registrations.map((registration) => registration.user_id);
    const opponentsUserIds = tournament.pairings.filter((pairing) => (
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
      ...competitor!.registrations.map((registration) => registration.user_id),
    ], [] as (string | null)[]);

    // const opponentUserIds = tournament.pairings.filter((pairing) => (
    //   [pairing.competitor_0_id, pairing.competitor_1_id].includes(competitor.id)
    // )).reduce((acc, pairing) => {
    //   if (pairing.competitor_0_id === competitor.id) {
    //     acc.push(...)
    //   }
    // }, [] as string[]);
  });

  // Calc results

  // Push to the overall 
};