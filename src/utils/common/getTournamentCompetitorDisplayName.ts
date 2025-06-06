import { TournamentCompetitor } from '~/api';
import { getCountryName } from '~/utils/common/getCountryName';
import { getUserDisplayNameString } from '~/utils/common/getUserDisplayNameString';

/**
 * Gets the display name for a tournament competitor.
 * 
 * @param competitor - A (deep) tournament competitor.
 * @returns - A display name string.
 */
export const getTournamentCompetitorDisplayName = (
  competitor?: TournamentCompetitor | null,
): string => {

  if (!competitor) {
    return '';
  }

  // If competitor has only 1 player, just use the player's name:
  if (competitor.players.length === 1 && competitor.players[0].user) {
    return getUserDisplayNameString(competitor.players[0].user);
  }

  // Use the country name if there is one, otherwise just use the team name:
  if (competitor.teamName) {
    const countryName = getCountryName(competitor.teamName);
    return countryName ?? competitor.teamName;
  }

  // Fallback:
  return 'Unknown Competitor';
};
