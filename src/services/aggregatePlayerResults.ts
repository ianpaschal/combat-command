import { FowV4RankingFactor } from '~/types/fowV4/fowV4RankingFactorSchema';
import { Match } from '~/types/Match';
import { TournamentPlayerRecord } from '~/types/TournamentPlayer';
import flamesOfWarV4Utils from '~/utils/flamesOfWarV4Utils';

export type ResultValues = Record<FowV4RankingFactor, number>;

export type AggregatedPlayerResults = {
  tournament_competitor_id: string;
  tournament_registration_id: string;
  user_id: string;
  results: ResultValues;
}[];

/**
 * Returns a ranked list of competitor IDs based on the ranking schema and their match results
 */
export const aggregatePlayerResults = (
  registrations: TournamentPlayerRecord[],
  matchResults: Match[],
  completedRounds: number,
): AggregatedPlayerResults => {
  const aggregatedResults = registrations.map(({ id, tournament_competitor_id, user_id }) => ({
    tournament_competitor_id,
    tournament_registration_id: id,
    user_id,
    results: {} as ResultValues,
  }));

  matchResults.forEach((matchResult) => {
    const wins = [
      matchResult.outcome.winner === 0 ? 1 : 0,
      matchResult.outcome.winner === 1 ? 0 : 1,
    ];
    const points = flamesOfWarV4Utils.calculateMatchScore(matchResult);
    const units_lost = [
      matchResult.outcome.player_0_units_lost,
      matchResult.outcome.player_1_units_lost,
    ];
    matchResult.players.forEach((player, self) => {
      const opponent = self === 0 ? 1 : 0; // 'self' and 'opponent' are quicker to read than index
      
      const newResults = {
        wins: wins[self],
        points: points[self],
        units_destroyed: units_lost[opponent],
        units_lost: units_lost[self],
        opponent_wins: wins[opponent],
        opponent_points: points[opponent],
        opponent_units_destroyed: units_lost[self],
        opponent_units_lost: units_lost[opponent],
      };

      const playerResultIndex = aggregatedResults.findIndex((r) => r.user_id === player.user_id);
      const playerResult = aggregatedResults[playerResultIndex];
      
      // Combine newResults with existingResults
      const updatedResults = Object.entries(newResults).reduce((acc, [key, value]) => {
        const totalKey = `total_${key}` as keyof ResultValues;
        const avgKey = `avg_${key}` as keyof ResultValues;
        const currentTotal = playerResult?.results[totalKey] || 0;
        const newTotal = currentTotal + value;
        return {
          ...acc,
          [totalKey]: newTotal,
          [avgKey]: newTotal / completedRounds,
        };
      }, {} as ResultValues);

      aggregatedResults.splice(playerResultIndex, 1, {
        ...playerResult,
        results: updatedResults,
      });
    });
  });
  return aggregatedResults;
};