import { ConvexError } from 'convex/values';

import { getErrorMessage } from '../../../common/errors';
import { TournamentCompetitorRanked } from '../../tournaments';
import { assignBye } from './assignBye';

/**
 * A tuple of TournamentCompetitorRanked's to be paired.
 */
export type CompetitorPair = [TournamentCompetitorRanked, TournamentCompetitorRanked | null];

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
  orderedCompetitors: TournamentCompetitorRanked[],
  allowRepeats: boolean = false,
): CompetitorPair[] => {
  const pairings: CompetitorPair[] = [];
    
  // Handle byes:
  const [byeCompetitor, restCompetitors]= assignBye(orderedCompetitors);
  if (byeCompetitor) {
    pairings.push([ byeCompetitor, null ]);
  }

  // Resolve pairings by input order:
  const resolvedPairings = recursivePair(restCompetitors, allowRepeats);
  if (resolvedPairings === null) {
    if (allowRepeats) {
      // TODO: Figure out if this is needed... it should be impossible!
      // ...but good to know if we ever see it, that it is, indeed, possible...
      throw new ConvexError(getErrorMessage('NO_VALID_PAIRINGS_POSSIBLE'));
    }
    throw new ConvexError(getErrorMessage('NO_VALID_PAIRINGS_POSSIBLE_WITHOUT_REPEAT'));
  }
  pairings.push(...resolvedPairings);
  return pairings;
};

/**
 * Depth‑first, rank‑biased backtracking search.
 */
export const recursivePair = (
  pool: TournamentCompetitorRanked[],
  allowRepeats: boolean,
): CompetitorPair[] | null => {
  if (pool.length === 0) {
    return []; // everyone paired
  }
  const [ anchor, ...rest ] = pool; // best remaining
  for (let i = 0; i < rest.length; ++i) {
    const opponent = rest[i];
    const havePlayed = anchor.opponentIds.includes(opponent.id);
    if (havePlayed && !allowRepeats) {
      continue; // hard‑constraint
    }
    const nextPool = rest.slice(0, i).concat(rest.slice(i + 1));
    const sub = recursivePair(nextPool, allowRepeats);
    if (sub) {
      return [ [ anchor, opponent ], ...sub ];
    } // success – unwind
  }
  return null; // dead end – back‑track
};
