import { useRef } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { Ellipsis } from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { PopoverMenu } from '~/components/generic/PopoverMenu';
import { toast } from '~/components/ToastProvider';
import { ConfirmConfigureRoundDialog } from '~/components/TournamentContextMenu/components/ConfirmConfigureRoundDialog';
import { ConfirmConfigureRoundDialogHandle } from '~/components/TournamentContextMenu/components/ConfirmConfigureRoundDialog/ConfirmConfigureRoundDialog';
import { getRemainingRequiredMatchResults } from '~/components/TournamentContextMenu/TournamentContextMenu.utils';
import { useTournament } from '~/components/TournamentProvider';
import { useGetTournamentPairings } from '~/services/tournamentPairings';
import {
  useDeleteTournament,
  useEndTournament,
  useEndTournamentRound,
  useGetTournamentOpenRound,
  usePublishTournament,
  useStartTournament,
  useStartTournamentRound,
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
  const navigate = useNavigate();

  const user = useAuth();
  const {
    _id: id,
    status,
    currentRound,
    lastRound,
    title,
    organizerUserIds,
  } = useTournament();
  const nextRound = (lastRound ?? -1) + 1;
  const nextRoundLabel = nextRound + 1;
  const currentRoundLabel = (currentRound ?? 0) + 1;

  const { data: openRound } = useGetTournamentOpenRound({ id });
  const { data: nextRoundPairings } = useGetTournamentPairings({
    tournamentId: id,
    round: nextRound,
  });

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
      toast.success(`${title} started!`);
    },
  });

  const { mutation: startTournamentRound } = useStartTournamentRound({
    onSuccess: (): void => {
      toast.success(`Round ${currentRoundLabel} started!`);
    },
  });

  const { mutation: endTournament } = useEndTournament({
    onSuccess: (): void => {
      toast.success(`${title} completed!`);
    },
  });

  const { mutation: endTournamentRound } = useEndTournamentRound({
    onSuccess: (): void => {
      toast.success(`Round ${currentRoundLabel} completed!`);
    },
  });

  const confirmConfigureRoundDialogRef = useRef<ConfirmConfigureRoundDialogHandle>(null);

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
      label: `Configure Round ${nextRoundLabel}`,
      onClick: () => confirmConfigureRoundDialogRef.current?.open(),
      visible: status === 'active' && !openRound && !nextRoundPairings?.length,
    },
    {
      label: `Start Round ${nextRoundLabel}`,
      onClick: () => startTournamentRound({ id }),
      visible: status === 'active' && !openRound && nextRoundPairings?.length,
    },
    {
      label: `End Round ${(currentRound ?? 0) + 1}`,
      onClick: () => endTournamentRound({ id }),
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
    <>
      <PopoverMenu menuItems={visibleMenuItems}>
        <Button variant={variant} size={size} className={className}>
          <Ellipsis />
        </Button>
      </PopoverMenu>
      <ConfirmConfigureRoundDialog ref={confirmConfigureRoundDialogRef} />
    </>
  );
};
