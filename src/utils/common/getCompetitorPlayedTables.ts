import { TournamentDeep } from '~/types/db';

export const getCompetitorPlayedTables = (
  tournament: TournamentDeep,
  competitorId: string,
): number[] => {

  const relevantPairings = tournament.pairings.filter((pairing) => (
    [pairing.competitor_0.id, pairing.competitor_1.id].includes(competitorId)
  ));

  return relevantPairings.reduce((acc, pairing) => [
    ...acc,
    pairing.table_index,
  ], [] as number[]);
};