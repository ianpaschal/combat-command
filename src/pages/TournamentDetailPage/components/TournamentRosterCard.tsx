import { ReactElement } from 'react';
import { generatePath } from 'react-router-dom';
import clsx from 'clsx';
import {
  Link,
  UserMinus,
  UserPlus,
} from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { toast } from '~/components/ToastProvider';
import { TournamentCompetitorCard } from '~/components/TournamentCompetitorCard';
import { TournamentCreateTeamDialog } from '~/components/TournamentCreateTeamDialog';
import { useTournamentCreateTeamDialog } from '~/components/TournamentCreateTeamDialog/TournamentCreateTeamDialog.hooks';
import { useTournament } from '~/components/TournamentProvider';
import { TournamentDetailsCard } from '~/pages/TournamentDetailPage/components/TournamentDetailsCard';
import { useCreateTournamentCompetitor } from '~/services/tournamentCompetitors/useCreateTournamentCompetitor';
import { useGetTournamentCompetitorsByTournamentId } from '~/services/tournamentCompetitors/useGetTournamentCompetitorsByTournamentId';
import { usePublishTournament } from '~/services/tournaments';
import { PATHS } from '~/settings';

import styles from './TournamentRosterCard.module.scss';

export interface TournamentRosterCardProps {
  className?: string;
}

export const TournamentRosterCard = ({
  className,
}: TournamentRosterCardProps): JSX.Element => {
  const user = useAuth();
  const tournament = useTournament();
  const userIsPlayer = !!(user && tournament.playerUserIds.includes(user._id));
  const userIsOrganizer = !!(user && tournament.organizerUserIds.includes(user._id));

  const { open: openTournamentCreateTeamDialog } = useTournamentCreateTeamDialog(tournament._id);

  const { data: tournamentCompetitors, loading } = useGetTournamentCompetitorsByTournamentId(tournament._id);
  const { mutation: createTournamentCompetitor } = useCreateTournamentCompetitor({
    successMessage: `Successfully joined ${tournament.title}!`,
  });
  const { mutation: publishTournament } = usePublishTournament({
    successMessage: `${tournament.title} is now live!`,
  });

  const showEmptyState = !loading && tournamentCompetitors?.length == 0;

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
    if (userIsPlayer) {
      return [
        <Button variant="secondary">
          <UserMinus />Leave
        </Button>,
      ];
    }
    if (!tournament.useTeams && user && !userIsOrganizer && !userIsPlayer) {
      return [
        <Button onClick={handleRegister}>
          <UserPlus />Register
        </Button>,
      ];
    }
    if (tournament.useTeams && user && !userIsOrganizer && !userIsPlayer) {
      return [
        <Button onClick={openTournamentCreateTeamDialog}>
          <UserPlus />New Team
        </Button>,
      ];
    }
  };

  return (
    <TournamentDetailsCard
      className={clsx(className)}
      title="Roster"
      buttons={getPrimaryButtons()}
    >
      {showEmptyState ? (
        <div className={styles.TournamentRoster_EmptyState}>
          {tournament.status === 'draft' && userIsOrganizer ? (
            <>
              <p>Your tournament is not yet visible.</p>
              <Button onClick={handlePublish}>
                Publish
              </Button>
            </>
          ) : (
            <>
              <p>No competitors registered yet.</p>
              {userIsOrganizer && (
                <Button onClick={handleCopyLink}>
                  <Link />
                  Copy Link
                </Button>
              )}
            </>
          )}
        </div>
      ) : (
        <ScrollArea indicatorBorders="top">
          <div className={styles.TournamentRoster_CompetitorList}>
            {(tournamentCompetitors || []).map((tournamentCompetitor) => (
              <TournamentCompetitorCard
                key={tournamentCompetitor._id}
                tournamentCompetitor={tournamentCompetitor}
              />
            ))}
          </div>
        </ScrollArea>
      )}
      <TournamentCreateTeamDialog />
    </TournamentDetailsCard>
  );
};
