import { TournamentCompetitorDeep, TournamentDeep } from '~/types/db';

export const getCompetitorOpponents = (
  tournament: TournamentDeep,
  competitorId: string,
): TournamentCompetitorDeep[] => {

  const relevantPairings = tournament.pairings.filter((pairing) => (
    [pairing.competitor_0.id, pairing.competitor_1.id].includes(competitorId)
  ));

  return relevantPairings.map((pairing) => {
    if (pairing.competitor_1.id === competitorId) {
      return pairing.competitor_0;
    }
    return pairing.competitor_1;
  });
};