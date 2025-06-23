import { ReactElement } from 'react';
import { useQuery } from 'convex/react';
import { Ghost, HelpCircle } from 'lucide-react';

import { api, TournamentCompetitor } from '~/api';
import { Avatar } from '~/components/generic/Avatar';
import { FlagCircle } from '~/components/generic/FlagCircle';
import { getCountryName } from '~/utils/common/getCountryName';
import { getUserDisplayNameString } from '~/utils/common/getUserDisplayNameString';
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
  if (competitor.players.length === 1) {
    return <Avatar url={competitor.players[0]?.user?.avatarUrl} />;
  }
  return fallbackAvatar;
};

const getCompetitorDisplayName = (competitor: TournamentCompetitor): ReactElement => {
  if (competitor.teamName) {
    const countryName = getCountryName(competitor.teamName);
    return <span>{countryName ?? competitor.teamName}</span>;
  }
  if (competitor.players.length === 1 && competitor.players[0].user) {
    return <span>{getUserDisplayNameString(competitor.players[0].user)}</span >;
  }
  return fallbackDisplayName;
};

export const useIdentityElements = (identity: Identity, loading?: boolean): ReactElement[] => {
  const { user, userId, competitor, competitorId, placeholder } = identity;

  // TODO: Replace with a service hook
  const queryUser = useQuery(api.users.fetchUser.fetchUser, userId ? {
    id: userId,
  } : 'skip');
  // TODO: Replace with a service hook
  const queryCompetitor = useQuery(api.tournamentCompetitors.getTournamentCompetitor, competitorId ? {
    id: competitorId,
  } : 'skip');

  // Render loading skeleton if explicitly loading or an ID was provided and it is fetching
  if (loading || (userId && !queryUser) || competitorId && !queryCompetitor) {
    return [
      <Avatar loading />,
      <span>Loading...</span>,
    ];
  }

  if (user) {
    return [
      <Avatar url={user?.avatarUrl} />,
      <span>{getUserDisplayNameString(user)}</span>,
    ];
  }

  if (userId && queryUser) {
    return [
      <Avatar url={queryUser?.avatarUrl} />,
      <span>{getUserDisplayNameString(queryUser)}</span>,
    ];
  }

  if (competitor) {
    return [
      getCompetitorAvatar(competitor),
      getCompetitorDisplayName(competitor),
    ];
  }

  if (competitorId && queryCompetitor) {
    return [
      getCompetitorAvatar(queryCompetitor),
      getCompetitorDisplayName(queryCompetitor),
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
