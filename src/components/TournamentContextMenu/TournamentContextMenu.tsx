import { generatePath, useNavigate } from 'react-router-dom';
import { Ellipsis } from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { PopoverMenu } from '~/components/generic/PopoverMenu';
import { toast } from '~/components/ToastProvider';
import { getRemainingRequiredMatchResults } from '~/components/TournamentContextMenu/TournamentContextMenu.utils';
import { useTournament } from '~/components/TournamentProvider';
import {
  useDeleteTournament,
  useGetTournamentOpenRound,
  usePublishTournament,
  useStartTournament,
} from '~/services/tournaments';
import { PATHS } from '~/settings';
import { ElementSize } from '~/types/componentLib';

export interface TournamentContextMenuProps {
  className?: string;
  size?: ElementSize;
  variant?: 'secondary' | 'primary';
}

export const TournamentContextMenu = ({
  className,
  size = 'normal',
  variant = 'secondary',
}: TournamentContextMenuProps): JSX.Element | null => {
  const user = useAuth();
  const {
    _id: id,
    status,
    currentRound,
    lastRound,
    organizerUserIds,
  } = useTournament();
  const navigate = useNavigate();
  const { data: activeRound } = useGetTournamentOpenRound({ id });
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

  const { mutation: startTournament } = useStartTournament({
    onSuccess: (): void => {
      toast.success('Tournament started!');
    },
  });

  const menuItems = [
    {
      label: 'Publish',
      onClick: () => publishTournament({ id }),
      visible: status === 'draft',
    },
    {
      label: 'Edit',
      onClick: () => navigate(generatePath(PATHS.tournamentEdit, { id })),
      visible: status !== 'active' && status !== 'archived',
    },
    {
      label: 'Delete',
      onClick: () => deleteTournament({ id }),
      visible: status !== 'active' && status !== 'archived',
    },
    {
      label: 'Start',
      // TODO: Show confirmation dialog
      onClick: () => startTournament({ id }),
      visible: status === 'published',
    },
    {
      label: `Configure Round ${(lastRound ?? -1) + 2}`,
      onClick: () => navigate(generatePath(PATHS.tournamentAdvanceRound, { id })),
      visible: status === 'active' && activeRound === null,
    },
    {
      label: `Close Round ${currentRound! + 1}`,
      // eslint-disable-next-line no-console
      onClick: () => console.log('End Round'),
      visible: activeRound && getRemainingRequiredMatchResults(activeRound) === 0,
    },
  ];

  const visibleMenuItems = menuItems.filter((item) => item.visible);

  // TODO: Make better check for showing context menu
  const showContextMenu = user && organizerUserIds.includes(user._id) && visibleMenuItems.length;
  if (!showContextMenu) {
    return null;
  }
  return (
    <PopoverMenu menuItems={visibleMenuItems}>
      <Button variant={variant} size={size} className={className}>
        <Ellipsis />
      </Button>
    </PopoverMenu>
  );
};
