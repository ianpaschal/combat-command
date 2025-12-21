import { ReactElement } from 'react';
import { Ghost, HelpCircle } from 'lucide-react';

import { Avatar } from '~/components/generic/Avatar';
import { getTournamentCompetitorDisplayName } from '~/utils/common/getTournamentCompetitorDisplayName';
import { Identity } from './IdentityBadge.types';
import { TournamentCompetitorAvatar } from './TournamentCompetitorAvatar';

const fallbackAvatar: ReactElement = <Avatar icon={<HelpCircle />} muted />;
const fallbackDisplayName: ReactElement = <span>Unknown</span>;

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
      <TournamentCompetitorAvatar tournamentCompetitor={competitor} />,
      <span>{getTournamentCompetitorDisplayName(competitor)}</span>,
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
