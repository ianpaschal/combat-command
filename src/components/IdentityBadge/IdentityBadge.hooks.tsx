import { ReactElement } from 'react';
import { Ghost, HelpCircle } from 'lucide-react';

import { TournamentCompetitor } from '~/api';
import { Avatar } from '~/components/generic/Avatar';
import { FlagCircle } from '~/components/generic/FlagCircle';
import { getCountryName } from '~/utils/common/getCountryName';
import { Identity } from './IdentityBadge.types';

const fallbackAvatar: ReactElement = <Avatar icon={<HelpCircle />} muted />;
const fallbackDisplayName: ReactElement = <span>Unknown</span>;

const getCompetitorAvatar = (competitor: TournamentCompetitor): ReactElement => {
  if (competitor.teamName) {
    const countryName = getCountryName(competitor.teamName);
    if (countryName) {
      return <FlagCircle code={competitor.teamName} />;
    }
    return <Avatar isTeam />;
  }
  if (competitor.registrations.length === 1) {
    return <Avatar url={competitor.registrations[0]?.user?.avatarUrl} />;
  }
  return fallbackAvatar;
};

const getCompetitorDisplayName = (competitor: TournamentCompetitor): ReactElement => {
  if (competitor.teamName) {
    const countryName = getCountryName(competitor.teamName);
    return <span>{countryName ?? competitor.teamName}</span>;
  }
  if (competitor.registrations.length === 1 && competitor.registrations[0].user) {
    return <span>{competitor.registrations[0].user.displayName}</span >;
  }
  return fallbackDisplayName;
};

export const useIdentityElements = (identity: Identity, loading?: boolean): ReactElement[] => {
  const { user, competitor, placeholder } = identity;

  // Render loading skeleton if explicitly loading 
  if (loading) {
    return [
      <Avatar loading />,
      <span>Loading...</span>,
    ];
  }

  if (user) {
    return [
      <Avatar url={user?.avatarUrl} />,
      <span>{user.displayName}</span>,
    ];
  }

  if (competitor) {
    return [
      getCompetitorAvatar(competitor),
      getCompetitorDisplayName(competitor),
    ];
  }

  if (placeholder) {
    return [
      <Avatar icon={placeholder.icon ?? <Ghost />} muted />,
      <span>{placeholder.displayName}</span>,
    ];
  }

  // If none of the values have been provided, return the empty state
  // NOTE: If user or competitor is meant to be provided, but undefined because it is loading (externally) the empty state should be avoided by passing loading = true
  return [
    fallbackAvatar,
    fallbackDisplayName,
  ];
};
