import { TournamentCompetitor } from '~/api';
import { getCountryName } from '~/utils/common/getCountryName';

/**
 * Gets the display name for a tournament competitor.
 * 
 * @param competitor - A (deep) tournament competitor.
 * @returns - A display name string.
 */
export const getTournamentCompetitorDisplayName = (
  competitor?: TournamentCompetitor | null,
): string => {

  const fallBack = 'Unknown Competitor';

  if (!competitor) {
    return fallBack;
  }

  const activeRegistrations = competitor.registrations.filter((r) => r.active);

  // If competitor has only 1 player, just use the player's name:
  if (activeRegistrations.length === 1 && activeRegistrations[0].user) {
    return activeRegistrations[0].user.displayName;
  }

  // Use the country name if there is one, otherwise just use the team name:
  if (competitor.teamName) {
    const countryName = getCountryName(competitor.teamName);
    return countryName ?? competitor.teamName;
  }

  // Fallback:
  return fallBack;
};
