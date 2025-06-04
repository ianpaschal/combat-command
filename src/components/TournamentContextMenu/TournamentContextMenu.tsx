import { generatePath, useNavigate } from 'react-router-dom';
import { Ellipsis } from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { PopoverMenu } from '~/components/generic/PopoverMenu';
import { toast } from '~/components/ToastProvider';
import { getRemainingRequiredMatchResults } from '~/components/TournamentContextMenu/TournamentContextMenu.utils';
import { useTournament } from '~/components/TournamentProvider';
import {
  useCloseTournamentRound,
  useDeleteTournament,
  useEndTournament,
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
    title,
    organizerUserIds,
  } = useTournament();
  const navigate = useNavigate();
  const { data: openRound } = useGetTournamentOpenRound({ id });

  const { mutation: deleteTournament } = useDeleteTournament({
    onSuccess: (): void => {
      toast.success(`${title} deleted!`);
      navigate(PATHS.tournaments);
    },
  });

  const { mutation: publishTournament } = usePublishTournament({
    onSuccess: (): void => {
      toast.success(`${title} is now published!`);
    },
  });

  const { mutation: startTournament } = useStartTournament({
    onSuccess: (): void => {
      toast.success(`${title} has started!`);
    },
  });

  const { mutation: endTournament } = useEndTournament({
    onSuccess: (): void => {
      toast.success(`${title} completed!`);
    },
  });

  const { mutation: closeTournamentRound } = useCloseTournamentRound({
    onSuccess: (): void => {
      toast.success(`Round ${(currentRound ?? 0) + 1} completed!`);
    },
  });

  const menuItems = [
    {
      label: 'Edit',
      onClick: () => navigate(generatePath(PATHS.tournamentEdit, { id })),
      visible: status !== 'active' && status !== 'archived',
    },
    {
      label: 'Delete',
      onClick: () => deleteTournament({ id }),
      // TODO: Implement confirmation dialog
      visible: status !== 'active' && status !== 'archived',
    },
    {
      label: 'Publish',
      onClick: () => publishTournament({ id }),
      // TODO: Implement confirmation dialog
      visible: status === 'draft',
    },
    {
      label: 'Start',
      onClick: () => startTournament({ id }),
      visible: status === 'published',
    },
    {
      label: `Configure Round ${(lastRound ?? -1) + 2}`,
      onClick: () => navigate(generatePath(PATHS.tournamentAdvanceRound, { id })),
      visible: status === 'active' && currentRound === undefined,
    },
    {
      label: `Close Round ${currentRound! + 1}`,
      onClick: () => closeTournamentRound({ id }),
      visible: openRound && getRemainingRequiredMatchResults(openRound) === 0,
    },
    {
      label: 'End Tournament',
      onClick: () => endTournament({ id }),
      // TODO: More checks, show confirmation dialog if not complete
      visible: status === 'active',
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
