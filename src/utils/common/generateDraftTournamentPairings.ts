import { TournamentPairingDeep } from '~/types/db/TournamentPairings';

interface RankedCompetitorExtended {
  id: string;
  playedCompetitorIds: string[]; // Comeptitor IDs
  playedTables: number[];
}

export const generateDraftTournamentPairings = (
  rankedCompetitorIds: string[],
  previousPairings: TournamentPairingDeep[],
) => {

  // Enrich the ranked competitor IDs with necessary pairing information (prev. opponents & tables)
  const rankedCompetitorsExtended = rankedCompetitorIds.map((id) => {
    const competitorExtended: RankedCompetitorExtended = {
      id,
      playedCompetitorIds: [],
      playedTables: [],
    };
    previousPairings.forEach((pairing) => {
      if (pairing.competitor_0_id === id) {
        competitorExtended.playedCompetitorIds.push(pairing.competitor_1_id);
        competitorExtended.playedTables.push(pairing.table_index);
        return;
      }
      if (pairing.competitor_1_id === id) {
        competitorExtended.playedCompetitorIds.push(pairing.competitor_0_id);
        competitorExtended.playedTables.push(pairing.table_index);
        return;
      }
    });
    return competitorExtended;
  });

  const unpairedCompetitors = [...rankedCompetitorsExtended];
  const draftPairings = [];

  while (unpairedCompetitors.length >= 2) {

    // Take top-ranked unpaired competitor as competitor 0 & remove from array
    const competitor_0 = unpairedCompetitors[0];
    unpairedCompetitors.splice(0, 1);

    // Filter unpaired competitors down to ones which were not played yet by competitor 0
    const unplayedCompetitors = unpairedCompetitors.filter((competitor) => (
      !competitor.playedCompetitorIds.includes(competitor_0.id)
    ));

    // Take top-ranked unplayed competitor as competitor 1 & remove from array
    let competitor_1: RankedCompetitorExtended | null;
    if (unplayedCompetitors.length) {
      competitor_1 = unplayedCompetitors[0];
      const competitorIndex = unpairedCompetitors.findIndex((competitor) => competitor_1 && competitor.id === competitor_1.id);
      if (competitorIndex > -1) {
        unpairedCompetitors.splice(competitorIndex, 1);
      } else {
        console.error('Something went wrong... opponent ID was not found in unpaired competitors list...');
      }
    } else {
      competitor_1 = null;
    }

    // Add IDs to draft pairings
    draftPairings.push({ competitor_0, competitor_1 });
  } 

};