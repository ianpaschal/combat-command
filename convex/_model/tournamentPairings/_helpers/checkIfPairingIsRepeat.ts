import { DeepTournamentCompetitor } from '../../tournamentCompetitors';

/**
 * Checks if two competitors have already played each other.
 */

export const checkIfPairingIsRepeat = (
  a: DeepTournamentCompetitor | null,
  b: DeepTournamentCompetitor | null,
): boolean => !!a && !!b && (a.opponentIds.includes(b._id) || b.opponentIds.includes(a._id));
