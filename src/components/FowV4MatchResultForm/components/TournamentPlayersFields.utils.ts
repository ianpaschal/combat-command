import { TournamentCompetitor } from '~/api';

export const getCompetitorPlayerOptions = (competitor?: TournamentCompetitor | null) => {
  if (!competitor) {
    return [];
  }
  return competitor.players.map((player) => ({
    value: player.user._id,
    label: player.user.displayName,
  })); 
};
