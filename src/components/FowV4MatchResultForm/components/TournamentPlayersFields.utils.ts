import { TournamentCompetitor } from '~/api';

export const getCompetitorPlayerOptions = (competitor?: TournamentCompetitor | null) => {
  if (!competitor) {
    return [];
  }
  return competitor.registrations.map((r) => ({
    value: r.user?._id ?? '',
    label: r.user?.displayName ?? '',
  })); 
};
