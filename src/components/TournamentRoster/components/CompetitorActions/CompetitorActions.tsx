import { MouseEvent } from 'react';
import { Ellipsis, UserPlus } from 'lucide-react';

import { TournamentCompetitor } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { ConfirmationDialog, useConfirmationDialog } from '~/components/ConfirmationDialog';
import { Button } from '~/components/generic/Button';
import { Label } from '~/components/generic/Label';
import { PopoverMenu } from '~/components/generic/PopoverMenu';
import { Switch } from '~/components/generic/Switch';
import { useTournamentCompetitorEditDialog } from '~/components/TournamentCompetitorEditDialog';
import { useTournament } from '~/components/TournamentProvider';
import {
  useAddTournamentCompetitorPlayer,
  useDeleteTournamentCompetitor,
  useRemoveTournamentCompetitorPlayer,
  useToggleTournamentCompetitorActive,
} from '~/services/tournamentCompetitors';

import styles from './CompetitorActions.module.scss';

export interface CompetitorActionsProps {
  competitor: TournamentCompetitor;
}

export const CompetitorActions = ({
  competitor,
}: CompetitorActionsProps): JSX.Element => {
  const user = useAuth();
  const tournament = useTournament();
  const { open: openEditDialog } = useTournamentCompetitorEditDialog();
  const confirmDeleteCompetitorDialogId = `confirm-delete-competitor-${competitor._id}`;
  const { open: openConfirmDeleteDialog } = useConfirmationDialog(confirmDeleteCompetitorDialogId);
  const { mutation: toggleActive } = useToggleTournamentCompetitorActive();
  const { mutation: addPlayer } = useAddTournamentCompetitorPlayer({
    successMessage: `Successfully joined ${tournament.title}!`,
  });
  const { mutation: removePlayer } = useRemoveTournamentCompetitorPlayer({
    successMessage: `Successfully left ${tournament.title}!`,
  });
  const { mutation: deleteCompetitor } = useDeleteTournamentCompetitor({
    successMessage: 'Successfully deleted!',
  });

  const handleToggleActive = (e: MouseEvent): void => {
    e.stopPropagation();
    toggleActive({ id: competitor._id });
  };

  const handleJoin = (e: MouseEvent): void => {
    e.stopPropagation();
    addPlayer({
      playerUserId: user!._id,
      tournamentCompetitorId: competitor._id,
    });
  };

  const handleDelete = (): void => {
    deleteCompetitor({ id: competitor._id });
  };

  const isOrganizer = user && tournament.organizerUserIds.includes(user._id);
  const isPlayer = user && !!competitor.players.find((player) => player.user._id === user._id);
  const isFull = competitor.players.length >= tournament.competitorSize;

  const showCheckInToggle = user && isOrganizer && tournament.status === 'active' && tournament.currentRound === undefined;
  const showJoinButton = user && !isFull && !tournament.playerUserIds.includes(user._id) && tournament.status === 'published';

  // TODO: Add list submissions
  // const showListsButton = user && (isOrganizer || isPlayer) && status !== 'archived';

  const menuItems = [
    {
      label: 'Leave',
      onClick: () => removePlayer({
        playerUserId: user!._id,
        tournamentCompetitorId: competitor._id,
      }),
      visible: user && isPlayer && tournament.status !== 'archived',
    },
    {
      label: 'Edit',
      onClick: () => openEditDialog({ tournamentCompetitor: competitor }),
      visible: user && (isOrganizer || (isPlayer && tournament.useTeams)) && tournament.status !== 'archived' && tournament.currentRound === undefined,
    },
    {
      label: 'Delete',
      onClick: () => openConfirmDeleteDialog(),
      visible: user && isOrganizer && tournament.status === 'published',
    },
  ];

  const visibleMenuItems = menuItems.filter((item) => item.visible);

  return (
    <>
      <div className={styles.CompetitorActions}>
        {showCheckInToggle && (
          <>
            <Label>Checked In</Label>
            <Switch onClick={handleToggleActive} checked={competitor.active} />
          </>
        )}
        {showJoinButton && (
          <Button variant="primary" onClick={handleJoin}>
            <UserPlus />
            Join
          </Button>
        )}
        {visibleMenuItems.length > 0 && (
          <PopoverMenu menuItems={visibleMenuItems}>
            <Button variant="secondary">
              <Ellipsis />
            </Button>
          </PopoverMenu>
        )}
      </div>
      <ConfirmationDialog
        id={confirmDeleteCompetitorDialogId}
        title="Confirm Delete Competitor"
        description="Are you sure you want to delete this competitor? This cannot be undone!"
        intent="danger"
        onConfirm={handleDelete}
      />
    </>
  );
};
