import { isValidOpponent } from '../helpers/isValidOpponent';
import { DraftPairing, RankedTournamentCompetitor } from '../helpers/pairingTypes';
import { shuffle } from '../helpers/shuffle';

export const generateDraftRandomPairings = (competitors: RankedTournamentCompetitor[]) => {

  const pairings: DraftPairing[] = [];

  // Iterate over every competitor
  competitors.forEach((competitor) => {
    const validOpponents = competitors.filter((c) => isValidOpponent(competitor, c, pairings));

    // Get random valid opponent
    const opponent = shuffle(validOpponents).pop();
    if (opponent) {
      pairings.push([competitor, opponent]);
    }
  });

  const unpairedCompetitors = competitors.filter((competitor) => !pairings.find((p) => p.filter((c) => !!c).map((c) => c.id).includes(competitor.id)));

  return {
    pairings,
    unpairedCompetitors,
  };
};
