import { TournamentPairingPolicies, TournamentPairingPolicy } from '@ianpaschal/combat-command-game-systems/common';

import { DeepTournamentCompetitor } from '../../tournamentCompetitors';
import { TournamentPairingStatus } from '../types';
import { checkIfPairingIsRepeat } from './checkIfPairingIsRepeat';
import { checkIfPairingIsSameAlignment } from './checkIfPairingIsSameAlignment';

/**
 * Validates a tournament pairing and returns a status with message.
 *
 * @param a - First competitor (or null for bye)
 * @param b - Second competitor (or null for bye)
 * @param options - Pairing options (allowRepeats, allowSameAlignment)
 * @param table - Optional table assignment for table-related warnings
 * @returns TournamentPairingStatus with 'error', 'warning', or 'ok' status
 */
export const validateTournamentPairing = (
  policies: TournamentPairingPolicies,
  a: DeepTournamentCompetitor | null,
  b: DeepTournamentCompetitor | null,
  table?: number | null,
): TournamentPairingStatus => {
  const { repeat, sameAlignment } = policies ?? {
    repeat: TournamentPairingPolicy.Block,
    sameAlignment: TournamentPairingPolicy.Block,
  };

  // Both competitors present - check pairing constraints
  if (a && b) {

    // Check repeat opponents (error):
    if (checkIfPairingIsRepeat(a, b)) {
      const message = 'These opponents have already played each other.';
      if (repeat === TournamentPairingPolicy.Block) {
        return { status: 'error', message };
      }
      if (repeat === TournamentPairingPolicy.Avoid) {
        return { status: 'warning', message };
      }
    }

    // Check same alignment (error):
    if (checkIfPairingIsSameAlignment(a, b)) {
      const message = 'These opponents have the same alignment.';
      if (sameAlignment === TournamentPairingPolicy.Block) {
        return { status: 'error', message };
      }
      if (sameAlignment === TournamentPairingPolicy.Avoid) {
        return { status: 'warning', message };
      }
    }
  }

  // Bye scenarios - check for multiple byes (warning):
  if (a && !b && a.byeRounds.length > 0) {
    return {
      status: 'warning',
      message: `${a.displayName} has already had a bye.`,
    };
  }
  if (!a && b && b.byeRounds.length > 0) {
    return {
      status: 'warning',
      message: `${b.displayName} has already had a bye.`,
    };
  }

  // Table-related warnings
  if (table !== null && table !== undefined && table > -1) {
    if (a && a.playedTables.includes(table)) {
      return {
        status: 'warning',
        message: `${a.displayName} has already played this table.`,
      };
    }
    if (b && b.playedTables.includes(table)) {
      return {
        status: 'warning',
        message: `${b.displayName} has already played this table.`,
      };
    }
  }

  return {
    status: 'ok',
    message: 'Pairing is valid.',
  };
};
