import { DeepTournamentCompetitor } from '../../tournamentCompetitors';

/**
 * Checks if two competitors have the same alignment and cannot be paired.
 * Returns true if they have the same single alignment (conflict).
 * Returns false if pairing is allowed (flexible, multiple alignments, or different).
 */

export const checkIfPairingIsSameAlignment = (
  a: DeepTournamentCompetitor,
  b: DeepTournamentCompetitor,
): boolean => {
  const aAlignments = a.details.alignments;
  const bAlignments = b.details.alignments;

  // If either competitor has no alignment data, allow pairing
  if (aAlignments.length === 0 || bAlignments.length === 0) {
    return false;
  }

  // A and B can be paired if:
  // at least 1 has alignment 'flexible'
  if (aAlignments.includes('flexible') || bAlignments.includes('flexible')) {
    return false;
  }

  // at least 1 has multiple alignments
  if (aAlignments.length > 1 || bAlignments.length > 1) {
    return false;
  }

  // both have 1 alignment each, but they're different
  if (aAlignments.length === 1 && bAlignments.length === 1 && aAlignments[0] !== bAlignments[0]) {
    return false;
  }

  // Otherwise, they have the same single alignment (conflict)
  return true;
};
