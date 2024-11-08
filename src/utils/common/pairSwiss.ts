import { TournamentPairingInput } from '~/types/db/TournamentPairings';
import { RankingFactorKey } from '~/types/fowV4/fowV4RankingFactorSchema';
import { CompetitorResult } from '~/utils/common/calculateTournamentRankings';

export const pairSwiss = <T extends RankingFactorKey>(
  rankedCompetitorResults: CompetitorResult<T>[],
  round_index: number,
  tournament_id: string,
): TournamentPairingInput[] => {
  const pairings: TournamentPairingInput[] = [];
  const unpairedCompetitors = [...rankedCompetitorResults];

  while(unpairedCompetitors.length > 2) {
    const competitor = unpairedCompetitors[0];

    const possibleOpponents = unpairedCompetitors.slice(1).filter(
      (possibleOpponent) => !competitor.opponentCompetitorIds.includes(possibleOpponent.competitor.id),
    );

    // Pick the next highest ranked competitor
    const opponent = possibleOpponents[0];
    const opponentIndex = unpairedCompetitors.findIndex(
      (unpairedCompetitor) => unpairedCompetitor.competitor.id === opponent.competitor.id,
    );

    if (competitor.competitor.id === opponent.competitor.id) {
      throw Error('Something went wrong... competitor is paired with self!');
    }

    pairings.push({
      competitor_0_id: competitor.competitor.id,
      competitor_1_id: opponent.competitor.id,
      round_index,
      table_index: pairings.length,
      tournament_id,
    });
    
    // Remove the opponent first, as it will always have a higher index than the competitor
    unpairedCompetitors.splice(opponentIndex, 1);
    unpairedCompetitors.splice(0, 1);
  }

  return pairings;
};