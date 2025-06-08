import {
  DraftTournamentPairing,
  DraftTournamentPairings,
  RankedTournamentCompetitor,
} from '../types';
import { checkOpponentIsValid } from './checkOpponentIsValid';
import { shuffle } from './shuffle';

// TODO: DOCUMENTATION

export const generateDraftRandomPairings = (competitors: RankedTournamentCompetitor[]): DraftTournamentPairings => {

  const pairings: DraftTournamentPairing[] = [];

  // Iterate over every competitor
  competitors.forEach((competitor) => {
    const validOpponents = competitors.filter((c) => checkOpponentIsValid(competitor, c, pairings));

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
