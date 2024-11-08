import { TournamentDeep } from '~/types/db';
import { TournamentPairingInput } from '~/types/db/TournamentPairings';
import { RankingFactorKey } from '~/types/fowV4/fowV4RankingFactorSchema';
import { TournamentPairingMethod } from '~/types/TournamentPairingMethod';
import { CompetitorResult } from '~/utils/common/calculateTournamentRankings';
import { pairRandom } from '~/utils/common/pairRandom';
import { pairSwiss } from '~/utils/common/pairSwiss';

export interface GenerateTournamentPairingsConfig {
  tournament: TournamentDeep;
  rankedCompetitorResults: CompetitorResult<RankingFactorKey>[];
  type: TournamentPairingMethod;
  roundIndex: number;
}

export const generateTournamentPairings = ({
  rankedCompetitorResults,
  tournament,
  type,
  roundIndex,
}: GenerateTournamentPairingsConfig): TournamentPairingInput[] => {

  // TODO: Perhaps make this async and fetch competitors and pairings separately

  // TODO: Both of these could use a preventReplay option
  if (type === 'random') {
    return pairRandom(rankedCompetitorResults, roundIndex, tournament.id);
  }
  if (type === 'swiss') {
    return pairSwiss(rankedCompetitorResults, roundIndex, tournament.id);
  }
  return [];
};
