import { MouseEvent } from 'react';
import clsx from 'clsx';
import { Ellipsis, UserPlus } from 'lucide-react';

import { TournamentCompetitor } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { ConfirmationDialog, useConfirmationDialog } from '~/components/ConfirmationDialog';
import { Button } from '~/components/generic/Button';
import { Label } from '~/components/generic/Label';
import { PopoverMenu } from '~/components/generic/PopoverMenu';
import { Switch } from '~/components/generic/Switch';
import { TournamentCompetitorEditDialog, useTournamentCompetitorEditDialog } from '~/components/TournamentCompetitorEditDialog';
import { useTournament } from '~/components/TournamentProvider';
import { useDeleteTournamentCompetitor, useToggleTournamentCompetitorActive } from '~/services/tournamentCompetitors';
import {
  useCreateTournamentRegistration,
  useDeleteTournamentRegistration,
  useGetTournamentRegistrationsByTournament,
} from '~/services/tournamentRegistrations';
import { isUserTournamentOrganizer } from '~/utils/common/isUserTournamentOrganizer';

import styles from './CompetitorActions.module.scss';

export interface CompetitorActionsProps {
  className?: string;
  competitor: TournamentCompetitor;
}

export const CompetitorActions = ({
  className,
  competitor,
}: CompetitorActionsProps): JSX.Element => {
  const user = useAuth();
  const tournament = useTournament();
  const {
    data: registrations,
    loading,
  } = useGetTournamentRegistrationsByTournament({
    tournamentId: competitor.tournamentId,
  });
  const { open: openEditDialog } = useTournamentCompetitorEditDialog(competitor._id);
  const confirmDeleteCompetitorDialogId = `confirm-delete-competitor-${competitor._id}`;
  const { open: openConfirmDeleteDialog } = useConfirmationDialog(confirmDeleteCompetitorDialogId);
  const { mutation: toggleActive } = useToggleTournamentCompetitorActive();
  const { mutation: createRegistration } = useCreateTournamentRegistration({
    successMessage: `Successfully joined ${tournament.title}!`,
  });
  const { mutation: deleteRegistration } = useDeleteTournamentRegistration({
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
    createRegistration({
      userId: user!._id,
      tournamentId: tournament._id,
      tournamentCompetitorId: competitor._id,
    });
  };

  const handleDelete = (): void => {
    deleteCompetitor({ id: competitor._id });
  };

  const ownRegistration = (registrations ?? []).find((r) => r.userId === user?._id);
  const competitorRegistrations = (registrations ?? []).filter((r) => r.tournamentCompetitorId === competitor._id);
  const isOrganizer = isUserTournamentOrganizer(user, tournament);
  const isPlayerForCompetitor = user && !loading && ownRegistration?.tournamentCompetitorId === competitor._id;
  const isCaptain = user && competitor.captainUserId === user._id;
  const isFull = competitorRegistrations.filter((r) => r.active).length >= tournament.competitorSize;

  const showCheckInToggle = isOrganizer && tournament.status === 'active' && tournament.currentRound === undefined;
  const showJoinButton = !isFull && !loading && !ownRegistration && tournament.useTeams && tournament.status === 'published';

  // TODO: Add list submissions
  // const showListsButton = user && (isOrganizer || isPlayer) && status !== 'archived';

  const menuItems = [
    {
      label: 'Edit',
      onClick: () => openEditDialog({ tournamentCompetitor: competitor }),
      visible: (isOrganizer || isCaptain) && tournament.status !== 'archived' && tournament.currentRound === undefined,
    },
    {
      label: 'Leave',
      onClick: () => {
        if (isPlayerForCompetitor) {
          deleteRegistration({ id: ownRegistration._id });
        }
      },
      visible: isPlayerForCompetitor && tournament.status === 'published',
    },
    {
      label: 'Remove',
      onClick: () => openConfirmDeleteDialog(),
      visible: isOrganizer && tournament.status === 'published',
    },
  ];

  const visibleMenuItems = menuItems.filter((item) => item.visible);

  return (
    <>
      <div className={clsx(styles.CompetitorActions, className)}>
        {showCheckInToggle && (
          <>
            <Switch onClick={handleToggleActive} checked={competitor.active} />
            <Label>Ready to Play</Label>
          </>
        )}
        {showJoinButton && (
          <Button icon={<UserPlus />} text="Join" variant="primary" onClick={handleJoin} />
        )}
        {visibleMenuItems.length > 0 && (
          <PopoverMenu menuItems={visibleMenuItems}>
            <Button icon={<Ellipsis />} variant="secondary" />
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
      <TournamentCompetitorEditDialog competitor={competitor} />
    </>
  );
};
