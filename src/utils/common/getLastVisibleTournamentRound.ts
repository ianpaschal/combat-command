import {
  CurrentUser,
  Tournament,
  User,
} from '~/api';
import { isUserTournamentOrganizer } from '~/utils/common/isUserTournamentOrganizer';

/**
 * Determines the last tournament round visible to the current user.
 * Non-organizers cannot view final round rankings until the tournament is archived.
 * @returns The last round which should be visible to the current user
 */
export const getLastVisibleTournamentRound = (
  tournament: Tournament,
  user: User | CurrentUser | null,
): number => {
  const lastRound = tournament.lastRound ?? 0;
  
  const isAfterFinalRound = lastRound + 1 === tournament.roundCount;
  const isActive = tournament.status === 'active';
  const isOrganizer = user && isUserTournamentOrganizer(user, tournament);
  
  if (isAfterFinalRound && isActive && !isOrganizer) {
    return Math.max(lastRound - 1, 0);
  } else {
    return lastRound;
  }
};
