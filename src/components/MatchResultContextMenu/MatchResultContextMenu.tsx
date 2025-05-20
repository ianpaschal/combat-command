import { Ellipsis } from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { PopoverMenu } from '~/components/generic/PopoverMenu';
import { MatchResultDeleteDialog, useMatchResultDeleteDialog } from '~/components/MatchResultDeleteDialog';
import { MatchResultEditDialog, useMatchResultEditDialog } from '~/components/MatchResultEditDialog';
import { useMatchResult } from '~/components/MatchResultProvider';

export interface MatchResultContextMenuProps {
  size?: 'small' | 'normal' | 'large';
}

export const MatchResultContextMenu = ({
  size = 'normal',
}: MatchResultContextMenuProps): JSX.Element | null => {
  const user = useAuth();
  const matchResult = useMatchResult();

  const { open: openEditDialog } = useMatchResultEditDialog(matchResult._id);
  const { open: openDeleteDialog } = useMatchResultDeleteDialog(matchResult._id);
  const contextMenuItems = [
    { label: 'Edit', onClick: openEditDialog },
    { label: 'Delete', onClick: openDeleteDialog },
  ];

  // TODO: Make better check for showing context menu
  const showContextMenu = user && !matchResult.tournamentPairingId && [matchResult.player0UserId, matchResult.player1UserId].includes(user._id);
  if (!showContextMenu) {
    return null;
  }
  return (
    <>
      <PopoverMenu menuItems={contextMenuItems}>
        <Button variant="secondary" size={size}>
          <Ellipsis />
        </Button>
      </PopoverMenu>
      <MatchResultEditDialog />
      <MatchResultDeleteDialog />
    </>
  );
};
