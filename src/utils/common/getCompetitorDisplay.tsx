import { ReactNode } from 'react';

import { Avatar } from '~/components/generic/Avatar';
import { FlagCircle } from '~/components/generic/FlagCircle';
import { TournamentCompetitorDeep } from '~/types/db';
import { getCountryName } from '~/utils/common/getCountryName';
import { getUserDisplayNameString } from '~/utils/common/getUserDisplayNameString';

// TODO: Add to paring cell
export const getCompetitorDisplay = (competitor: TournamentCompetitorDeep | undefined): [string, ReactNode] => {
  if (!competitor) {
    return [
      'Unknown Competitor',
      <span>Derp</span>,
    ];
  }

  // Is a team:
  if (competitor.players.length > 1) {
    if (competitor.country_code) {
      return [
        getCountryName(competitor.country_code) || 'Unknown Country',
        <FlagCircle code={competitor.country_code} />,
      ];
    }
    if (!competitor.country_code && competitor.team_name) {
      return [
        competitor.team_name,
        <span>Derp</span>,
      ];
    }
  }

  // Is single player:
  return [
    getUserDisplayNameString(competitor.players[0].profile),
    <Avatar avatarUrl={competitor.players[0].profile.avatar_url} />,
  ];
};
