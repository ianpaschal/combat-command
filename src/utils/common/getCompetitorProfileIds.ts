import { TournamentCompetitorDeep } from '~/types/db';

export const getCompetitorProfileIds = (competitor?: TournamentCompetitorDeep) => {
  if (!competitor) {
    return [];
  }
  return competitor.players.map((player) => player.profile.id);
};