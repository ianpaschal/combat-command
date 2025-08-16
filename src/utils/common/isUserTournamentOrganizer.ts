import { Tournament, User } from '~/api';

export const isUserTournamentOrganizer = (
  user: User | null,
  tournament?: Tournament | null,
): boolean => {
  if (!tournament || !user) {
    return false;
  }
  return !!tournament.organizers.find((to) => to.user?._id === user._id);
};
