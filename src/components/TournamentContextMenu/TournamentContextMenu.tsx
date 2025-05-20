import { generatePath, useNavigate } from 'react-router-dom';
import { Ellipsis } from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { PopoverMenu } from '~/components/generic/PopoverMenu';
import { toast } from '~/components/ToastProvider';
import { useTournament } from '~/components/TournamentProvider';
import { useDeleteTournament } from '~/services/tournaments/useDeleteTournament';
import { useFetchTournamentActiveRound } from '~/services/tournaments/useFetchTournamentActiveRound';
import { usePublishTournament } from '~/services/tournaments/usePublishTournament';
import { useStartTournament } from '~/services/tournaments/useStartTournament';
import { PATHS } from '~/settings';

export interface TournamentContextMenuProps {
  className?: string;
  size?: 'small' | 'normal' | 'large';
  variant?: 'secondary' | 'primary';
}

export const TournamentContextMenu = ({
  className,
  size = 'normal',
  variant = 'secondary',
}: TournamentContextMenuProps): JSX.Element | null => {
  const user = useAuth();
  const tournament = useTournament();
  const navigate = useNavigate();

  const { data: activeRound } = useFetchTournamentActiveRound(tournament._id);
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
      onClick: () => publishTournament({ id: tournament._id }),
      visible: tournament.status === 'draft',
    },
    {
      label: 'Edit',
      onClick: () => navigate(generatePath(PATHS.tournamentEdit, { id: tournament._id })),
      visible: tournament.status !== 'active' && tournament.status !== 'archived',
    },
    {
      label: 'Delete',
      onClick: () => deleteTournament({ id: tournament._id }),
      visible: tournament.status !== 'active' && tournament.status !== 'archived',
    },
    {
      label: 'Start',
      // TODO: Show confirmation dialog
      onClick: () => startTournament({ id: tournament._id }),
      visible: tournament.status === 'published',
    },
    {
      label: `Prepare Round ${(tournament.currentRound ?? 0) + 1}`,
      onClick: () => navigate(generatePath(PATHS.tournamentAdvanceRound, { id: tournament._id })),
      visible: activeRound && !activeRound.pairings.length,
    },
    {
      label: `Start Round ${tournament.currentRound! + 1}`,
      // eslint-disable-next-line no-console
      onClick: () => console.log('Start Round'),
      visible: activeRound && activeRound.pairings.length,
    },
    {
      label: `End Round ${tournament.currentRound! + 1}`,
      // eslint-disable-next-line no-console
      onClick: () => console.log('End Round'),
      visible: activeRound,
    },
  ];

  const visibleMenuItems = menuItems.filter((item) => item.visible);

  // TODO: Make better check for showing context menu
  const showContextMenu = user && tournament?.organizerUserIds.includes(user._id) && visibleMenuItems.length;
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
