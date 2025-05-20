import {
  ReactElement,
  ReactNode,
  useMemo,
} from 'react';

import { TournamentCompetitor, User } from '~/api';
import { Avatar } from '~/components/generic/Avatar';
import { FlagCircle } from '~/components/generic/FlagCircle';
import { getCountryName } from '~/utils/common/getCountryName';
import { getUserDisplayNameString } from '~/utils/common/getUserDisplayNameString';

export type GetDisplayNameInput = {
  user?: User;
  competitor?: TournamentCompetitor;
};

export const useDisplayName = ({
  user,
  competitor,
}: GetDisplayNameInput): ReactNode | null => useMemo(() => {
  if (!user && !competitor) {
    return null;
  }
  if (user && competitor) {
    throw new Error('Please supply only a user or a tournament competitor to <IdentityBadge/>!');
  }
  if (user) {
    return getUserDisplayNameString(user);
  }
  if (competitor) {
    if (competitor.players.length === 1 && competitor.players[0].user) {
      return getUserDisplayNameString(competitor.players[0].user);
    }
    if (competitor.teamName) {
      const countryName = getCountryName(competitor.teamName);
      return <span>{countryName ?? competitor.teamName}</span>;
    }
    return <span>Unknown Competitor</span>;
  }
  return 'Unknown User';
}, [user, competitor]);

export const useDisplayAvatar = ({
  user,
  competitor,
}: GetDisplayNameInput): ReactElement | null => useMemo(() => {
  if (!user && !competitor) {
    return null;
  }
  if (user && competitor) {
    throw new Error('Please supply only a user or a tournament competitor to <IdentityBadge/>!');
  }
  if (user) {
    return <Avatar url={user?.avatarUrl} />;
  }
  if (competitor) {
    if (competitor.players.length === 1) {
      return <Avatar url={competitor.players[0]?.user?.avatarUrl} />;
    }
    if (competitor.teamName) {
      const countryName = getCountryName(competitor.teamName);
      if (countryName) {
        return <FlagCircle code={competitor.teamName} />;
      }
      return <Avatar isTeam />;
    }
    return <span>Unknown Competitor</span>;
  }
  return <Avatar />;
}, [user, competitor]);
