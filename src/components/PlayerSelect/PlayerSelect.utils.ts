import { PlayerOption } from '~/components/PlayerSelect/PlayerSelect';
import { TournamentCompetitorDeep } from '~/types/db';
import { getUserDisplayNameString } from '~/utils/common/getUserDisplayNameString';

export const getCompetitorPlayerOptions = (
  competitor?: TournamentCompetitorDeep,
): PlayerOption[] => {
  if (!competitor) {
    return [];
  }
  return competitor.players.map((player) => ({
    value: player.id,
    label: getUserDisplayNameString(player.profile),
    avatar_url: player.profile.avatar_url,
    username: player.profile.username,
  }));
};
