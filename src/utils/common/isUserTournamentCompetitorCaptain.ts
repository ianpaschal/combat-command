import { TournamentCompetitor, User } from '~/api';

export const isUserTournamentCompetitorCaptain = (
  user: User | null,
  tournamentCompetitor?: TournamentCompetitor | null,
): boolean => {
  if (!user || !tournamentCompetitor) {
    return false;
  }
  return user?._id && tournamentCompetitor.captainUserId === user._id;
};
