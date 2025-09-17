import { Ellipsis } from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { PopoverMenu } from '~/components/generic/PopoverMenu';
import { MatchResultDeleteDialog, useMatchResultDeleteDialog } from '~/components/MatchResultDeleteDialog';
import { MatchResultEditDialog, useMatchResultEditDialog } from '~/components/MatchResultEditDialog';
import { useMatchResult } from '~/components/MatchResultProvider';
import { useGetTournament } from '~/services/tournaments';
import { isUserTournamentOrganizer } from '~/utils/common/isUserTournamentOrganizer';

export interface MatchResultContextMenuProps {
  size?: 'small' | 'normal' | 'large';
}

export const MatchResultContextMenu = ({
  size = 'normal',
}: MatchResultContextMenuProps): JSX.Element | null => {
  const user = useAuth();
  const matchResult = useMatchResult();
  const { data: tournament } = useGetTournament(matchResult.tournamentId ? {
    id: matchResult.tournamentId,
  } : 'skip');

  const { open: openEditDialog } = useMatchResultEditDialog(matchResult._id);
  const { open: openDeleteDialog } = useMatchResultDeleteDialog(matchResult._id);

  // TODO: Make better check for showing context menu
  const isOrganizer = isUserTournamentOrganizer(user, tournament);
  const isPlayer = user && [matchResult.player0UserId, matchResult.player1UserId].includes(user._id);

  const showContextMenu = isOrganizer || (isPlayer && !matchResult.tournamentId); // Don't allow editing of tournament results
  const contextMenuItems = [
    { label: 'Edit', onClick: openEditDialog },
    { label: 'Delete', onClick: openDeleteDialog },
  ];

  if (!showContextMenu) {
    return null;
  }
  return (
    <>
      <PopoverMenu menuItems={contextMenuItems}>
        <Button icon={<Ellipsis />} size={size} variant="secondary" />
      </PopoverMenu>
      <MatchResultEditDialog />
      <MatchResultDeleteDialog />
    </>
  );
};
