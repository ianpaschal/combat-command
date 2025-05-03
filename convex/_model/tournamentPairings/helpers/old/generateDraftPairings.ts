import { Id } from '../../../../_generated/dataModel';

export type DraftPairing = [RankedCompetitor, RankedCompetitor];

export type RankedCompetitor = {
  id: Id<'tournamentCompetitors'>;
  opponentIds: Id<'tournamentCompetitors'>[];
  byeRound?: number;
  rank: number; // Can't use index once we start moving competitors around
};

export const generateDraftPairings = (rankedCompetitors: RankedCompetitor[]) => {
  const unpairedCompetitors = [...rankedCompetitors];
  const couldNotPair: RankedCompetitor[] = [];

  const pairings: DraftPairing[] = [];

  const isValidOpponent = (a: RankedCompetitor, b: RankedCompetitor): boolean => (
    // Redundant but bug-proof
    a.id !== b.id && !a.opponentIds.includes(b.id) && !b.opponentIds.includes(a.id)
  );
  const removeOpponentFromUnpaired = (id: Id<'tournamentCompetitors'>): void => {
    unpairedCompetitors.splice(unpairedCompetitors.findIndex((item) => item.id === id), 1);
  };
  // const removeOpponentFromCouldNotPair = (id: Id<'tournamentCompetitors'>): void => {
  //   couldNotPair.splice(couldNotPair.findIndex((item) => item.id === id), 1);
  // };

  /**
   * 1. The highest ranked competitor is paired against the next highest ranked competitor which
   *    they have not played yet.
   * 2. These two competitors are removed from the pool of unpaired competitors.
   * 3. The new highest ranked unpaired competitor in the unpaired pool is paired against the next
   *    highest ranked competitor which they have not played yet.
   * 4. And so on until 2 or fewer competitors remain unpaired.
   * 
   * At this point, towards the end of the rankings and especially later in a the tournament, there
   * may be some unpaired competitors left over because everyone higher ranked has already been
   * paired and everyone similarly ranked they've already played (e.g. by round 4, a few competitors
   * might be "battling for last place"). For these...
   * 
   * 1. Existing pairings are sorted based on the lowest rank within them.
   * 2. If the lowest-ranking pairing can be broken so that at least 2 unpaired competitors can now
   *    be joined to the broken pairing's competitors (and increase the number of pairings by 1),
   *    that is done.
   * 3. Repeat until the number of unpaired competitors is less than 2 (if there is 0, yay, if there
   *    is 1, because of an odd number of competitors, they get a bye).
   */

  while(unpairedCompetitors.length >= 2) {
    const competitor = unpairedCompetitors[0];
    const opponent = unpairedCompetitors.find((c) => isValidOpponent(competitor, c));
    if (opponent) {
      pairings.push([competitor, opponent]);
      removeOpponentFromUnpaired(competitor.id);
      removeOpponentFromUnpaired(opponent.id);
    } else {

      // Prevent getting stuck by saving for later
      couldNotPair.push(competitor);
      removeOpponentFromUnpaired(competitor.id);
    }
  }

  // console.log('pairings', pairings);

  // If there are at least 2 unpaired competitors try to shift things around
  // if (couldNotPair.length >= 2 && couldNotPair.length % 2 === 0) {
  //   const tryReshuffle = () => {
  //     const reversedUnpaired = [...couldNotPair].sort((a, b) => b.rank - a.rank);

  //     const sortedPairings = [...pairings].sort((a, b) => {
  //       const maxRankA = Math.max(a[0].rank, a[1].rank);
  //       const maxRankB = Math.max(b[0].rank, b[1].rank);
  //       return maxRankB - maxRankA; // Sort descending by lowest rank
  //     });

  //     for (const pairing of sortedPairings) {
  //       const [p1, p2] = pairing;

  //       // Try to find *two* unpaired competitors that can replace this pair
  //       for (let i = 0; i < reversedUnpaired.length; i++) {
  //         for (let j = i + 1; j < reversedUnpaired.length; j++) {
  //           const c1 = reversedUnpaired[i];
  //           const c2 = reversedUnpaired[j];

  //           if (
  //             isValidOpponent(p1, c1) && isValidOpponent(p2, c2)
  //           ) {
  //             pairings.push([p1, c1], [p2, c2]);
  //             removeOpponentFromCouldNotPair(c1.id);
  //             removeOpponentFromCouldNotPair(c2.id);
  //             // Remove the original pairing
  //             const index = pairings.indexOf(pairing);
  //             if (index !== -1) pairings.splice(index, 1);
  //             return true;
  //           }

  //           if (
  //             isValidOpponent(p1, c2) && isValidOpponent(p2, c1)
  //           ) {
  //             pairings.push([p1, c2], [p2, c1]);
  //             removeOpponentFromCouldNotPair(c1.id);
  //             removeOpponentFromCouldNotPair(c2.id);
  //             const index = pairings.indexOf(pairing);
  //             if (index !== -1) pairings.splice(index, 1);
  //             return true;
  //           }
  //         }
  //       }
  //     }
  //     return false;
  //   };

  //   tryReshuffle();
  // }
  return {
    pairings,
    unpairedCompetitors: couldNotPair,
  };
};

/*

TO Flow:

Close round.
Check number of competitors and players.
  
  If a competitor is understrength, TO selects resolution:
    - Pair anyway, players will get auto-wins
    - Add another player
    - Remove the competitor
  Checkbox for rest of tournament or not

  If uneven number of competitors, ask if TO wants a bye or create new competitor
Generate pairings.
Commit pairings.
Start new round + timer;

*/
