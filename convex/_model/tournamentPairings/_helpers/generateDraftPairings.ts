import { ConvexError } from 'convex/values';

import { getErrorMessage } from '../../common/errors';
import { DeepTournamentCompetitor } from '../../tournamentCompetitors';
import { assignBye } from './assignBye';

/**
 * A tuple of tournament competitors to be paired.
 */
export type CompetitorPair = [DeepTournamentCompetitor, DeepTournamentCompetitor | null];

export type PairingOptions = Partial<{
  allowRepeats: boolean;
  allowSameAlignment: boolean;
}>;

/**
 * Generates draft pairings for an array of ranked TournamentCompetitors.
 * 
 * @remarks This uses a recursive, depth‑first, order-biased backtracking search.
 * This means each item is attempted to be paired with the next closest item by index.
 * In the case of adjacent (Swiss) pairing, the order would be by rank, but for random pairings the order would be randomized.
 * 
 * @param orderedCompetitors - Ordered array of competitors
 * @param allowRepeats - Allow repeat match-ups
 * @returns An array of 
 */
export const generateDraftPairings = (
  orderedCompetitors: DeepTournamentCompetitor[],
  options: PairingOptions = {
    allowRepeats: false,
    allowSameAlignment: true,
  },
): CompetitorPair[] => {
  const pairings: CompetitorPair[] = [];
    
  // Handle byes:
  const [byeCompetitor, restCompetitors] = assignBye(orderedCompetitors);
  if (byeCompetitor) {
    pairings.push([ byeCompetitor, null ]);
  }

  // Resolve pairings by input order:
  const resolvedPairings = recursivePair(restCompetitors, options);
  if (resolvedPairings === null) {
    throw new ConvexError(getErrorMessage('NO_VALID_PAIRINGS_POSSIBLE'));
  }
  pairings.push(...resolvedPairings);
  return pairings;
};

/**
 * Depth‑first, rank‑biased backtracking search.
 */
export const recursivePair = (
  pool: DeepTournamentCompetitor[],
  options: PairingOptions,
): CompetitorPair[] | null => {
  if (pool.length === 0) {
    return []; // everyone paired
  }
  const [ anchor, ...rest ] = pool; // best remaining
  for (let i = 0; i < rest.length; ++i) {
    const opponent = rest[i];
    if (checkIfRepeat(anchor, opponent) && !options.allowRepeats) {
      continue; // hard‑constraint
    }
    if (checkIfSameAlignment(anchor, opponent) && !options.allowSameAlignment) {
      continue; // hard‑constraint
    }
    const nextPool = rest.slice(0, i).concat(rest.slice(i + 1));
    const sub = recursivePair(nextPool, options);
    if (sub) {
      return [ [ anchor, opponent ], ...sub ];
    } // success – unwind
  }
  return null; // dead end – back‑track
};

const checkIfRepeat = (
  a: DeepTournamentCompetitor,
  b: DeepTournamentCompetitor,
): boolean => {
  if (a.opponentIds.includes(b._id)) {
    return true;
  }
  return false;
};

const checkIfSameAlignment = (
  a: DeepTournamentCompetitor,
  b: DeepTournamentCompetitor,
): boolean => {
  const aAlignments = a.details.alignments;
  const bAlignments = b.details.alignments;

  // A and B must either:

  // have at least 1 with alignment 'flexible'
  if (aAlignments.includes('flexible') || bAlignments.includes('flexible')) {
    return false;
  }

  // have at least 1 with multiple alignments
  if (aAlignments.length > 1 || bAlignments.length > 1) {
    return false;
  }

  // have 1 each, but be different
  if (aAlignments.length === 1 && bAlignments.length === 1 && aAlignments[0] !== bAlignments[0]) {
    return false;
  }

  // Otherwise, they have the same single alignment
  return true;
};
