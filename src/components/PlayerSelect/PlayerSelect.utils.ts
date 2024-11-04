import { PlayerOption } from '~/components/PlayerSelect/PlayerSelect';
import { TournamentCompetitorDeep } from '~/types/db';
import { getUserDisplayName } from '~/utils/getUserDisplayName';

export const getCompetitorPlayerOptions = (
  competitor?: TournamentCompetitorDeep,
): PlayerOption[] => {
  if (!competitor) {
    return [];
  }
  return competitor.players.map((player) => ({
    value: player.id,
    label: getUserDisplayName(player.profile),
    avatar_url: player.profile.avatar_url,
    username: player.profile.username,
  }));
};