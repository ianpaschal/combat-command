// import blossom from 'edmonds-blossom';

// export function generateDraftAdjacentPairings(competitors: RankedTournamentCompetitor[]): PairingResult {
//   const sorted = [...competitors].sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0)); // Lower rank = higher seed
//   let byeCompetitor: RankedTournamentCompetitor | undefined;
//   let availableCompetitors = sorted;
//   // If a bye is required, assign it to the lowest ranked competitor which has not had a bye yet
//   if (sorted.length % 2 !== 0) {
//     byeCompetitor = [...sorted].reverse().find((c) => c.byeRounds.length === 0);
//     if (!byeCompetitor) {
//       throw new Error('All players have already received a bye.');
//     }
//     availableCompetitors = sorted.filter((c) => byeCompetitor && c.id !== byeCompetitor.id);
//   }
//   const edges: [number, number, number][] = [];
//   for (let i = 0; i < availableCompetitors.length; i++) {
//     for (let j = i + 1; j < availableCompetitors.length; j++) {
//       const a = availableCompetitors[i];
//       const b = availableCompetitors[j];
//       // Check if valid competitor
//       // TODO: Add check for self
//       if (a.opponentIds.includes(b.id) || b.opponentIds.includes(a.id)) {
//         continue;
//       }
//       const rankingProximity = -Math.abs(i - j);
//       edges.push([i, j, rankingProximity]);
//     }
//   }
//   const matching = blossom(edges, true); // max cardinality
//   const pairings: DraftPairing[] = [];
//   const paired = new Set<number>();
//   for (let i = 0; i < matching.length; i++) {
//     const j = matching[i];
//     if (i < j && j !== -1) {
//       pairings.push([availableCompetitors[i], availableCompetitors[j]]);
//       paired.add(i);
//       paired.add(j);
//     }
//   }
//   // Fallback if not all players were paired
//   if (paired.size < availableCompetitors.length) {
//     console.warn('Blossom pairing incomplete — using fallback greedy matcher.');
//     const used = new Set<string>(pairings.flat().filter((c) => !!c).map((c) => c.id));
//     const remaining = availableCompetitors.filter((c) => !used.has(c.id));
//     const fallbackPairs: DraftPairing[] = [];
//     while (remaining.length > 1) {
//       const a = remaining.shift()!;
//       const bIndex = remaining.findIndex((c) => !a.opponentIds.includes(c.id) && !c.opponentIds.includes(a.id));
//       if (bIndex === -1) {
//         throw new Error(`Unable to find valid fallback pair for competitor ${a.id}`);
//       }
//       const [b] = remaining.splice(bIndex, 1);
//       fallbackPairs.push([a, b]);
//     }
//     if (remaining.length > 0) {
//       throw new Error(`Unmatched competitor remains after fallback pairing: ${remaining[0].id}`);
//     }
//     pairings.push(...fallbackPairs);
//   }
//   return { pairings, unpairedCompetitors: byeCompetitor ? [byeCompetitor] : [] };
// }
// import blossom from 'edmonds-blossom';
/* ---------------------------------------------------------------------------------------------- */

import {
  DraftPairing,
  PairingResult,
  RankedTournamentCompetitor,
} from '../helpers/pairingTypes';

// type RankedTournamentCompetitor = {
//   id: string;
//   rank: number;
//   opponentIds: string[];
//   byeRounds: number[];
// };
// type DraftPairing = [RankedTournamentCompetitor, RankedTournamentCompetitor ];

// type PairingResult = {
//   pairings: DraftPairing[];
//   unpairedCompetitors: RankedTournamentCompetitor[];
// };

/**
 * Generates adjacent pairings.
 * @param competitors 
 */
export function generateDraftAdjacentPairings(competitors: RankedTournamentCompetitor[]): PairingResult {

  // Attempt to pair all competitors with the most closely ranked opponent.

  // Competitors can NOT play a competitor twice (one that appears in their opponentIds array).

  // Maximize the number of paired competitors, even if it means pairing some "up" or "down" (playing a less similar rank).

  // If there is an uneven number of competitors, put the lowest ranked one which has not yet had a bye (byeRounds.length === 0) in the unpaired competitors array.

  // If competitors absolutely cannot be paired, add them to the unpaired competitors array.

  // const pairings: DraftPairing[] = [];
  // const unpairedCompetitors: RankedTournamentCompetitor[] = [];

  // // Sort by rank (ascending)
  // const sorted = [...competitors].sort((a, b) => a.rank - b.rank);
  // const used = new Set<string>();

  // for (let i = 0; i < sorted.length; i++) {
  //   const a = sorted[i];
  //   if (used.has(a.id)) continue;

  //   // Find the best available match
  //   let bestMatchIdx = -1;
  //   let bestRankDiff = Infinity;

  //   for (let j = i + 1; j < sorted.length; j++) {
  //     const b = sorted[j];
  //     if (used.has(b.id)) continue;
  //     if (a.opponentIds.includes(b.id) || b.opponentIds.includes(a.id)) continue;

  //     const rankDiff = Math.abs(a.rank - b.rank);
  //     if (rankDiff < bestRankDiff) {
  //       bestRankDiff = rankDiff;
  //       bestMatchIdx = j;
  //     }
  //   }

  //   if (bestMatchIdx !== -1) {
  //     const b = sorted[bestMatchIdx];
  //     pairings.push([a, b]);
  //     used.add(a.id);
  //     used.add(b.id);
  //   }
  // }

  // // Collect unpaired competitors
  // const remaining = sorted.filter(c => !used.has(c.id));

  // if (remaining.length % 2 === 1) {
  //   const byeCandidate = [...remaining]
  //     .filter(c => c.byeRounds.length === 0)
  //     .sort((a, b) => b.rank - a.rank)
  //     .pop();

  //   if (byeCandidate) {
  //     unpairedCompetitors.push(byeCandidate);
  //     const idx = remaining.findIndex(c => c.id === byeCandidate.id);
  //     if (idx !== -1) remaining.splice(idx, 1);
  //   }
  // }

  // unpairedCompetitors.push(...remaining);
  // return { pairings, unpairedCompetitors };

  // ALT VERSION:
  const pairings: DraftPairing[] = [];
  const unpairedCompetitors: RankedTournamentCompetitor[] = [];

  // Sort competitors by rank (ascending: best first)
  const sorted = [...competitors].sort((a, b) => a.rank - b.rank);
  const used = new Set<string>();

  const workingPool = [...sorted];

  // 💡 Pre-remove bye if odd number of competitors
  if (workingPool.length % 2 === 1) {
    const byeCandidate = [...workingPool]
      .filter(c => c.byeRounds.length === 0)
      .sort((a, b) => b.rank - a.rank) // lowest-ranked first
      .pop();

    if (byeCandidate) {
      unpairedCompetitors.push(byeCandidate);
      const idx = workingPool.findIndex(c => c.id === byeCandidate.id);
      if (idx !== -1) workingPool.splice(idx, 1);
    }
  }

  // Greedy pairing
  for (let i = 0; i < workingPool.length; i++) {
    const a = workingPool[i];
    if (used.has(a.id)) continue;

    let bestMatch: RankedTournamentCompetitor | null = null;
    // let bestMatchIndex = -1;
    let bestRankDiff = Infinity;

    for (let j = i + 1; j < workingPool.length; j++) {
      const b = workingPool[j];
      if (used.has(b.id)) continue;

      if (a.opponentIds.includes(b.id) || b.opponentIds.includes(a.id)) continue;

      const rankDiff = Math.abs(a.rank - b.rank);
      if (rankDiff < bestRankDiff) {
        bestMatch = b;
        // bestMatchIndex = j;
        bestRankDiff = rankDiff;
      }
    }

    if (bestMatch) {
      pairings.push([a, bestMatch]);
      used.add(a.id);
      used.add(bestMatch.id);
    }
  }

  // Any remaining unpaired competitors
  const remaining = workingPool.filter(c => !used.has(c.id));
  unpairedCompetitors.push(...remaining);

  return { pairings, unpairedCompetitors };
}
