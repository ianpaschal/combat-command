import { TournamentPairingPolicies, TournamentPairingPolicy } from '@ianpaschal/combat-command-game-systems/common';
import { ConvexError } from 'convex/values';

import { getErrorMessage } from '../../common/errors';
import { DeepTournamentCompetitor } from '../../tournamentCompetitors';
import { assignBye } from './assignBye';
import { validateTournamentPairing } from './validateTournamentPairing';

/**
 * A tuple of tournament competitors to be paired.
 */
export type CompetitorPair = [DeepTournamentCompetitor, DeepTournamentCompetitor | null];

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
  polices: TournamentPairingPolicies,
): CompetitorPair[] => {
  const pairings: CompetitorPair[] = [];
    
  // Handle byes:
  const [byeCompetitor, restCompetitors] = assignBye(orderedCompetitors);
  if (byeCompetitor) {
    pairings.push([ byeCompetitor, null ]);
  }

  // Resolve pairings by input order:
  const resolvedPairings = recursivePair(restCompetitors, polices);
  if (resolvedPairings === null) {
    
    // NOTE: In principle these should never happen, but it's good to know if they do.

    // Check if allowing repeats would have worked:
    if (polices.repeat !== TournamentPairingPolicy.Allow) {
      const withRepeats = recursivePair(restCompetitors, {
        ...polices,
        repeat: TournamentPairingPolicy.Allow,
      });
      if (withRepeats !== null) {
        throw new ConvexError(getErrorMessage('NO_VALID_PAIRINGS_POSSIBLE_WITHOUT_REPEAT'));
      }
    }

    // Check if allowing same alignment would have worked:
    if (polices.sameAlignment !== TournamentPairingPolicy.Allow) {
      const withSameAlignment = recursivePair(restCompetitors, {
        ...polices,
        sameAlignment: TournamentPairingPolicy.Allow,
      });
      if (withSameAlignment !== null) {
        throw new ConvexError(getErrorMessage('NO_VALID_PAIRINGS_POSSIBLE_WITHOUT_SAME_ALIGNMENT'));
      }
    }

    // Otherwise throw a generic error:
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
  policies: TournamentPairingPolicies,
): CompetitorPair[] | null => {
  if (pool.length === 0) {
    return []; // everyone paired
  }
  const [ anchor, ...rest ] = pool; // best remaining
  for (let i = 0; i < rest.length; ++i) {
    const opponent = rest[i];

    // If the potential pairing is invalid, skip and continue:
    if (validateTournamentPairing(policies, anchor, opponent).status === 'error') {
      continue; // hard‑constraint
    }
    const nextPool = rest.slice(0, i).concat(rest.slice(i + 1));
    const sub = recursivePair(nextPool, policies);
    if (sub) {
      return [ [ anchor, opponent ], ...sub ];
    } // success – unwind
  }
  return null; // dead end – back‑track
};
