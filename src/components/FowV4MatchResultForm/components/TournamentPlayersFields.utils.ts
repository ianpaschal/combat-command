import { FetchTournamentCompetitorResponse } from '~/api';
import { getUserDisplayNameString } from '~/utils/common/getUserDisplayNameString';

export const getCompetitorPlayerOptions = (competitor?: FetchTournamentCompetitorResponse) => {
  if (!competitor) {
    return [];
  }
  return competitor.players.map((player) => ({
    value: player.user?._id || '', // TODO: Remove once Convex code is changed to always return users
    label: getUserDisplayNameString(player.user),
  })); 
};
