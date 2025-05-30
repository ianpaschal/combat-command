import { ReactElement, useMemo } from 'react';
import { Ghost } from 'lucide-react';

import { Avatar } from '~/components/generic/Avatar';
import { FlagCircle } from '~/components/generic/FlagCircle';
import { getCountryName } from '~/utils/common/getCountryName';
import { getUserDisplayNameString } from '~/utils/common/getUserDisplayNameString';

import { IdentityBadgeInput } from './IdentityBadge.types';

const checkInput = (input: IdentityBadgeInput): void => {
  const providedInputCount = Object.values(input).filter((i) => !!i).length;
  if (providedInputCount < 1) {
    throw new Error('Please supply either a user, tournament competitor, or placeholder to <IdentityBadge/>!');
  }
  if (providedInputCount > 1) {
    throw new Error('Please supply only a user, tournament competitor, or placeholder to <IdentityBadge/>!');
  }
};

export const useDisplayName = (input: IdentityBadgeInput): ReactElement => useMemo(() => {
  checkInput(input);
  const { user, competitor, placeholder } = input;

  if (user) {
    return <span>{getUserDisplayNameString(user)}</span>;
  }
  if (competitor) {
    if (competitor.players.length === 1 && competitor.players[0].user) {
      return <span>{getUserDisplayNameString(competitor.players[0].user)}</span >;
    }
    if (competitor.teamName) {
      const countryName = getCountryName(competitor.teamName);
      return <span>{countryName ?? competitor.teamName}</span>;
    }
    return <span>Unknown Competitor</span>;
  }
  if (placeholder) {
    return <span>{placeholder.displayName}</span>;
  }
  return <span>Unknown User</span>;
}, [input]);

export const useDisplayAvatar = (input: IdentityBadgeInput): ReactElement => useMemo(() => {
  checkInput(input);
  const { user, competitor, placeholder } = input;

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
    return <Avatar />;
  }
  if (placeholder) {
    return <Avatar icon={placeholder.icon ?? <Ghost />} muted />;
  }
  return <Avatar />;
}, [input]);
