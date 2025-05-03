import { generatePath, useNavigate } from 'react-router-dom';
import { Ellipsis } from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { PopoverMenu } from '~/components/generic/PopoverMenu';
import { toast } from '~/components/ToastProvider';
import { useTournament } from '~/components/TournamentProvider';
import { useDeleteTournament } from '~/services/tournaments/useDeleteTournament';
import { usePublishTournament } from '~/services/tournaments/usePublishTournament';
import { PATHS } from '~/settings';

export interface TournamentContextMenuProps {
  className?: string;
  size?: 'small' | 'normal' | 'large';
}

export const TournamentContextMenu = ({
  className,
  size = 'normal',
}: TournamentContextMenuProps): JSX.Element | null => {
  const user = useAuth();
  const tournament = useTournament();
  const navigate = useNavigate();

  const { mutation: deleteTournament } = useDeleteTournament({
    onSuccess: (): void => {
      toast.success('Tournament deleted!');
      navigate(PATHS.tournaments);
    },
  });

  const { mutation: publishTournament } = usePublishTournament({
    onSuccess: (): void => {
      toast.success('Tournament is now published!');
      navigate(PATHS.tournaments);
    },
  });

  const contextMenuItems = [
    { label: 'Publish', onClick: () => publishTournament({ id: tournament._id }) },
    { label: 'Edit', onClick: () => navigate(generatePath(PATHS.tournamentEdit, { id: tournament._id })) },
    { label: 'Delete', onClick: () => deleteTournament({ id: tournament._id }) },
  ];

  // TODO: Make better check for showing context menu
  const showContextMenu = user && tournament?.organizerUserIds.includes(user._id) && contextMenuItems.length;
  if (!showContextMenu) {
    return null;
  }
  return (
    <PopoverMenu menuItems={contextMenuItems}>
      <Button variant="secondary" size={size} className={className}>
        <Ellipsis />
      </Button>
    </PopoverMenu>
  );
};
