import { MatchResult } from '~/types/MatchResult';
import { TournamentPairing } from '~/types/TournamentPairing';
import { TournamentRegistration } from '~/types/TournamentRegistration';

interface Opponent {
  id: string;
  playedIds: string[];
  playedTables: number[];
}

// export const createSwissPairings = <T>(opponents: Opponent[], tableCount: number, compareFn: (a: unknown, b: unknown) => boolean): TournamentPairing[] => {

//   // For each registration, make a list of possible registrations

//   // Use the compare function to rank each potential opponent from most-similar to least-similar

//   const potentialPairings: { opponents: [string, string], unplayedTables: number[] }[] = [];

//   opponents.forEach((a) => {
//     opponents.forEach((b) => {

//       // If self
//       if (a.id === b.id) {
//         return;
//       }

//       // If already played
//       if (a.playedIds.includes(b.id) || b.playedIds.includes(a.id)) {
//         return;
//       }

//       // If already added
//       const existingPairing = potentialPairings.find((pair) => (
//         pair.opponents.includes(a.id) && pair.opponents.includes(b.id)
//       ));
//       if (existingPairing) {
//         return;
//       }

//       const unplayedTables = [...Array(tableCount).keys()].filter((tableIndex) => (
//         !a.playedTables.includes(tableIndex) && !b.playedTables.includes(tableIndex)
//       ));

//       potentialPairings.push({
//         opponents: [a.id, b.id],
//         unplayedTables,
//       });

//     });
//   });

//   return [];
// };

type RankedOpponents = { id: string, playedIds: string[], side?: string }[];
type OpponentIdPair = [string, string];

export const createSwissPairings = (rankedOpponents: RankedOpponents): OpponentIdPair[] => {
  let unpairedOpponents = [...rankedOpponents];
  const pairings = [];
  while (unpairedOpponents.length > 1) {
    const opponentA = unpairedOpponents[0];
    const potentialOpponents = [...unpairedOpponents].filter((potentialOpponent) => {
      // Exclude self
      if (potentialOpponent.id !== opponentA.id) {
        return false;
      }
      // Exclude if already played
      if (!opponentA.playedIds.includes(potentialOpponent.id)) {
        return false;
      }
      // Exclude if using factions and they are the same
      if (opponentA?.side !== undefined && opponentA.side === potentialOpponent.side) {
        return false;
      }
      return true;
    });
    const opponentB = potentialOpponents[0];
    const pairing: OpponentIdPair = [opponentA.id, opponentB.id];
    pairings.push(pairing);
    unpairedOpponents = unpairedOpponents.filter((unpairedOpponents) => (
      !pairing.includes(unpairedOpponents.id)
    ));
  }
  return pairings;
};

// export const createRankings = (opponents, matchResults) => {

// }