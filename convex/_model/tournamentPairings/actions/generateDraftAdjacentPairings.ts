import blossom from 'edmonds-blossom';

import {
  DraftPairing,
  PairingResult,
  RankedCompetitor,
} from '../helpers/pairingTypes';

export function generateDraftAdjacentPairings(competitors: RankedCompetitor[]): PairingResult {
  const sorted = [...competitors].sort((a, b) => a.rank - b.rank); // Lower rank = higher seed

  let byeCompetitor: RankedCompetitor | undefined;
  let availableCompetitors = sorted;

  // If a bye is required, assign it to the lowest ranked competitor which has not had a bye yet
  if (sorted.length % 2 !== 0) {
    byeCompetitor = [...sorted].reverse().find((c) => c.byeRound === null);
    if (!byeCompetitor) {
      throw new Error('All players have already received a bye.');
    }
    availableCompetitors = sorted.filter((c) => byeCompetitor && c.id !== byeCompetitor.id);
  }

  const edges: [number, number, number][] = [];

  for (let i = 0; i < availableCompetitors.length; i++) {
    for (let j = i + 1; j < availableCompetitors.length; j++) {
      const a = availableCompetitors[i];
      const b = availableCompetitors[j];

      // Check if valid competitor
      // TODO: Add check for self
      if (a.opponentIds.includes(b.id) || b.opponentIds.includes(a.id)) {
        continue;
      }

      const rankingProximity = -Math.abs(i - j);
      edges.push([i, j, rankingProximity]);
    }
  }

  const matching = blossom(edges, true); // max cardinality
  const pairings: DraftPairing[] = [];

  const paired = new Set<number>();

  for (let i = 0; i < matching.length; i++) {
    const j = matching[i];
    if (i < j && j !== -1) {
      pairings.push([availableCompetitors[i], availableCompetitors[j]]);
      paired.add(i);
      paired.add(j);
    }
  }

  // Fallback if not all players were paired
  if (paired.size < availableCompetitors.length) {
    console.warn('Blossom pairing incomplete — using fallback greedy matcher.');

    const used = new Set<string>(pairings.flat().map((c) => c.id));
    const remaining = availableCompetitors.filter((c) => !used.has(c.id));

    const fallbackPairs: DraftPairing[] = [];

    while (remaining.length > 1) {
      const a = remaining.shift()!;
      const bIndex = remaining.findIndex((c) => !a.opponentIds.includes(c.id) && !c.opponentIds.includes(a.id));

      if (bIndex === -1) {
        throw new Error(`Unable to find valid fallback pair for competitor ${a.id}`);
      }

      const [b] = remaining.splice(bIndex, 1);
      fallbackPairs.push([a, b]);
    }

    if (remaining.length > 0) {
      throw new Error(`Unmatched competitor remains after fallback pairing: ${remaining[0].id}`);
    }

    pairings.push(...fallbackPairs);
  }

  return { pairings, unpairedCompetitors: byeCompetitor ? [byeCompetitor] : [] };
}
