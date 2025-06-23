import { ReactElement } from 'react';
import { generatePath } from 'react-router-dom';
import clsx from 'clsx';
import {
  EyeOff,
  Link,
  UserPlus,
  Users,
} from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { toast } from '~/components/ToastProvider';
import { useTournamentCompetitors } from '~/components/TournamentCompetitorsProvider';
import { TournamentCreateTeamDialog } from '~/components/TournamentCreateTeamDialog';
import { useTournamentCreateTeamDialog } from '~/components/TournamentCreateTeamDialog/TournamentCreateTeamDialog.hooks';
import { useTournament } from '~/components/TournamentProvider';
import { TournamentRoster } from '~/components/TournamentRoster';
import { useCreateTournamentCompetitor, useGetTournamentCompetitorsByTournament } from '~/services/tournamentCompetitors';
import { usePublishTournament } from '~/services/tournaments';
import { PATHS } from '~/settings';
import { TournamentDetailCard } from '../TournamentDetailCard';
import { TournamentTabEmptyState } from '../TournamentTabEmptyState';

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
  const { open: openTournamentCreateTeamDialog } = useTournamentCreateTeamDialog(tournament._id);
  const { data: tournamentCompetitors, loading } = useGetTournamentCompetitorsByTournament({ tournamentId: tournament._id });
  const { mutation: createTournamentCompetitor } = useCreateTournamentCompetitor({
    successMessage: `Successfully joined ${tournament.title}!`,
  });
  const { mutation: publishTournament } = usePublishTournament({
    successMessage: `${tournament.title} is now live!`,
  });

  const showLoadingState = loading;
  const showEmptyState = !loading && !tournamentCompetitors?.length;

  const isOrganizer = user && tournament.organizerUserIds.includes(user._id);

  const handleRegister = (): void => {
    if (!user) {
      return;
    }
    createTournamentCompetitor({
      tournamentId: tournament._id,
      players: [{ userId: user._id, active: true }],
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

  const getPrimaryButtons = (): ReactElement[] | undefined => {
    const isPlayer = user && tournament.playerUserIds.includes(user._id);
    const isFull = competitors?.length >= tournament.competitorSize;
    if (!isPlayer && !isFull) {
      if (tournament.useTeams) {
        return [
          <Button onClick={openTournamentCreateTeamDialog}>
            <UserPlus />New Team
          </Button>,
        ];
      }
      return [
        <Button onClick={handleRegister}>
          <UserPlus />Register
        </Button>,
      ];
    }
  };

  const emptyStateProps = tournament.status === 'draft' && isOrganizer ? {
    icon: <EyeOff />,
    message: 'Your tournament is not yet visible.',
    children: <Button onClick={handlePublish}>Publish</Button>,
  } : {
    icon: <Users />,
    message: 'No competitors registered yet.',
    children: isOrganizer ? (
      <Button onClick={handleCopyLink}>
        <Link />
        Copy Link
      </Button>
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
          <TournamentTabEmptyState {...emptyStateProps} />
        ) : (
          <TournamentRoster className={styles.TournamentRoster_CompetitorList} />
        )
      )}
      <TournamentCreateTeamDialog />
    </TournamentDetailCard>
  );
};
