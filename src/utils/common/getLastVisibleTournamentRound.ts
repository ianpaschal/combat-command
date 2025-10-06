import {
  CurrentUser,
  Tournament,
  User,
} from '~/api';
import { isUserTournamentOrganizer } from '~/utils/common/isUserTournamentOrganizer';

/**
 * 
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
