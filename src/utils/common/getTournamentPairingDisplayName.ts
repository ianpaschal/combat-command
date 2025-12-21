import { TournamentPairing } from '~/api';

/**
 * Gets the display name for a tournament pairing.
 * 
 * @param tournamentPairing - A (deep) tournament pairing.
 * @returns  - A display name string.
 */
export const getTournamentPairingDisplayName = (
  tournamentPairing: TournamentPairing,
): string => {
  const {
    tournamentCompetitor0,
    tournamentCompetitor1,
  } = tournamentPairing;
  return `${tournamentCompetitor0.displayName} vs. ${tournamentCompetitor1?.displayName ?? 'Bye'}`;
};
