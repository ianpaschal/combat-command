import { ReactElement } from 'react';
import { generatePath } from 'react-router-dom';
import clsx from 'clsx';
import {
  EyeOff,
  Link,
  UserPlus,
  Users,
} from 'lucide-react';

import { VisibilityLevel } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { EmptyState } from '~/components/EmptyState';
import { Button } from '~/components/generic/Button';
import { toast } from '~/components/ToastProvider';
import { TournamentCompetitorEditDialog, useTournamentCompetitorEditDialog } from '~/components/TournamentCompetitorEditDialog';
import { useTournamentCompetitors } from '~/components/TournamentCompetitorsProvider';
import { useTournament } from '~/components/TournamentProvider';
import { TournamentRoster } from '~/components/TournamentRoster';
import { useCreateTournamentCompetitor, useGetTournamentCompetitorsByTournament } from '~/services/tournamentCompetitors';
import { usePublishTournament } from '~/services/tournaments';
import { PATHS } from '~/settings';
import { isUserTournamentOrganizer } from '~/utils/common/isUserTournamentOrganizer';
import { ConfirmRegisterDialog, useConfirmRegisterDialog } from '../ConfirmRegisterDialog';
import { TournamentDetailCard } from '../TournamentDetailCard';

import styles from './TournamentRosterCard.module.scss';

export interface TournamentRosterCardProps {
  className?: string;
}

export const TournamentRosterCard = ({
  className,
}: TournamentRosterCardProps): JSX.Element => {
  const user = useAuth();
  const tournament = useTournament();
  const competitors = useTournamentCompetitors();
  const { open: openConfirmNameVisibilityDialog } = useConfirmRegisterDialog();
  const { open: openCreateDialog } = useTournamentCompetitorEditDialog();
  const { data: tournamentCompetitors, loading } = useGetTournamentCompetitorsByTournament({ tournamentId: tournament._id });
  const { mutation: createTournamentCompetitor } = useCreateTournamentCompetitor({
    successMessage: `Successfully joined ${tournament.title}!`,
  });
  const { mutation: publishTournament } = usePublishTournament({
    successMessage: `${tournament.title} is now live!`,
  });

  const showLoadingState = loading;
  const showEmptyState = !loading && !tournamentCompetitors?.length;

  const isOrganizer = isUserTournamentOrganizer(user, tournament);

  const handleRegister = (): void => {
    if (tournament.requireRealNames && user && user.nameVisibility < VisibilityLevel.Tournaments) {
      openConfirmNameVisibilityDialog({
        onConfirm: handleConfirmRegister,
      });
    } else {
      handleConfirmRegister();
    }
  };

  const handleConfirmRegister = (): void => {
    if (!user) {
      return;
    }
    createTournamentCompetitor({
      tournamentId: tournament._id,
      captainUserId: user._id,
    });
  };

  const handlePublish = (): void => {
    publishTournament({ id: tournament._id });
  };

  const handleCopyLink = async (): Promise<void> => {
    try {
      const detailsPath = generatePath(PATHS.tournamentDetails, { id: tournament._id });
      await navigator.clipboard.writeText(`${window.location.origin}${detailsPath}?tab=roster`);
      toast.info('Copied to clipboard!');
    } catch (error) {
      console.error(error);
    }
  };

  const getPrimaryButtons = (): ReactElement[] => {
    const isPlayer = user && tournament.playerUserIds.includes(user._id);
    const hasMaxTeams = (competitors || []).length >= tournament.maxCompetitors;
    const buttons: ReactElement[] = [];
    if (['published', 'active'].includes(tournament.status) && tournament.currentRound === undefined && isOrganizer) {
      buttons.push(
        <Button
          key="create-competitor"
          icon={<UserPlus />}
          text={`Add ${tournament.useTeams ? 'Team' : 'Player'}`}
          onClick={() => openCreateDialog()}
        />,
      );
    }
    if (tournament.status === 'published' && !isPlayer && !hasMaxTeams) {
      if (tournament.useTeams) {
        buttons.push(
          <Button key="new-team" icon={<UserPlus />} text="New Team" onClick={() => openCreateDialog()} />,
        );
      } else {
        buttons.push(
          <Button key="join" icon={<UserPlus />} text="Register" onClick={handleRegister} />,
        );
      }
    }
    return buttons;
  };

  const emptyStateProps = tournament.status === 'draft' && isOrganizer ? {
    icon: <EyeOff />,
    message: 'Your tournament is not yet visible.',
    children: <Button text="Publish" onClick={handlePublish} />,
  } : {
    icon: <Users />,
    message: 'No competitors registered yet.',
    children: isOrganizer ? (
      <Button icon={<Link />} text="Copy Link" onClick={handleCopyLink} />
    ) : undefined,
  };

  return (
    <TournamentDetailCard
      className={clsx(className)}
      title="Roster"
      buttons={getPrimaryButtons()}
    >
      {showLoadingState ? (
        <div className={styles.TournamentRoster_EmptyState}>
          Loading...
        </div>
      ) : (
        showEmptyState ? (
          <EmptyState {...emptyStateProps} />
        ) : (
          <TournamentRoster className={styles.TournamentRoster_CompetitorList} />
        )
      )}
      <TournamentCompetitorEditDialog />
      <ConfirmRegisterDialog />
    </TournamentDetailCard>
  );
};
