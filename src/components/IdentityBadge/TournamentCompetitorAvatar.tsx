import { forwardRef } from 'react';
import { HelpCircle } from 'lucide-react';

import { TournamentCompetitor } from '~/api';
import { Avatar, AvatarProps } from '~/components/generic/Avatar';
import { FlagCircle } from '~/components/generic/FlagCircle';
import { getCountryName } from '~/utils/common/getCountryName';

export type TournamentCompetitorAvatarProps = AvatarProps & {
  tournamentCompetitor?: TournamentCompetitor | null;
};

export const TournamentCompetitorAvatar = forwardRef<HTMLDivElement, TournamentCompetitorAvatarProps>(({
  tournamentCompetitor,
  ...avatarProps
}, ref) => {

  const fallBack = <Avatar ref={ref} icon={<HelpCircle />} muted {...avatarProps} />;

  if (!tournamentCompetitor) {
    return fallBack;
  }

  const activeRegistrations = tournamentCompetitor.registrations.filter((r) => r.active);

  // If competitor has only 1 player, just use the player's avatar:
  if (activeRegistrations.length === 1 && activeRegistrations[0].user) {
    return (
      <Avatar ref={ref} url={tournamentCompetitor.registrations[0]?.user?.avatarUrl} {...avatarProps} />
    );
  }

  // Use the country flag if there is one, otherwise just use the team icon:
  if (tournamentCompetitor.teamName) {
    const countryName = getCountryName(tournamentCompetitor.teamName);
    if (countryName) {
      return (
        <FlagCircle code={tournamentCompetitor.teamName} {...avatarProps} />
      );
    }
    return (
      <Avatar ref={ref} isTeam {...avatarProps} />
    );
  }

  // Fallback:
  return fallBack;
});

TournamentCompetitorAvatar.displayName = 'TournamentCompetitorAvatar';
