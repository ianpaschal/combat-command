import { useAuth } from '~/components/AuthProvider';
import { useTournament } from '~/components/TournamentProvider';
import { isUserTournamentOrganizer } from '~/utils/common/isUserTournamentOrganizer';

/**
 * 
 * @returns The last round which should be visible to the current user
 */
export const useLastVisibleRound = (): number => {
  const tournament = useTournament();
  const user = useAuth();
  const lastRound = tournament.lastRound ?? 0;
  const isFinalRound = lastRound + 1 === tournament.roundCount;
  if (isFinalRound && !isUserTournamentOrganizer(user, tournament)) {
    return Math.max(lastRound - 1, 0);
  } else {
    return lastRound;
  }
};
