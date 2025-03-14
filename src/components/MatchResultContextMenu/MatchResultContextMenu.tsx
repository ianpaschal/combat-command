import { Ellipsis } from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { PopoverMenu } from '~/components/generic/PopoverMenu';
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

  // TODO: Make better check for showing context menu
  const showContextMenu = user && !matchResult.tournamentPairingId && [matchResult.player0UserId, matchResult.player1UserId].includes(user._id);
  const contextMenuItems = [
    { label: 'Edit', onClick: openEditDialog },
    // TODO: Implement delete
    // { label: 'Delete', onClick: () => console.log('Delete') },
  ];

  if (!showContextMenu) {
    return null;
  }
  return (
    <>
      <PopoverMenu menuItems={contextMenuItems}>
        <Button muted size={size}>
          <Ellipsis />
        </Button>
      </PopoverMenu>
      <MatchResultEditDialog />
    </>
  );
};
