import { TournamentPairing } from '~/api';
import { getTournamentCompetitorDisplayName } from '~/utils/common/getTournamentCompetitorDisplayName';

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
  const displayName0 = getTournamentCompetitorDisplayName(tournamentCompetitor0);
  const displayName1 = tournamentCompetitor1 ? getTournamentCompetitorDisplayName(tournamentCompetitor1) : 'Bye';
  return `${displayName0} vs. ${displayName1}`;
};
