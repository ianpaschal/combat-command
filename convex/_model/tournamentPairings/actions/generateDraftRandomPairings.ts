import { isValidOpponent } from '../helpers/isValidOpponent';
import { DraftPairing, RankedCompetitor } from '../helpers/pairingTypes';
import { shuffle } from '../helpers/shuffle';

export const generateDraftRandomPairings = (competitors: RankedCompetitor[]) => {

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

  // If it SHOULD be possible to have everyone paired, fix it
  while (unpairedCompetitors.length > 1 && competitors.length % 2 === 0) {

    // Fix
    // This should never happen

  }

  return {
    pairings,
    unpairedCompetitors,
  };
};
