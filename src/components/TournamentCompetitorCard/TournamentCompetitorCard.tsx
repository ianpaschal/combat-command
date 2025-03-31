import clsx from 'clsx';
import { UserMinus, UserPlus } from 'lucide-react';

import { TournamentCompetitor } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { Avatar } from '~/components/generic/Avatar';
import { Button } from '~/components/generic/Button';
import { Card } from '~/components/generic/Card';
import { Separator } from '~/components/generic/Separator';
import { useTournament } from '~/components/TournamentProvider';
import { useAddPlayerToTournamentCompetitor } from '~/services/tournamentCompetitors/useAddPlayerToTournamentCompetitor';
import { useRemovePlayerFromTournamentCompetitor } from '~/services/tournamentCompetitors/useRemovePlayerFromTournamentCompetitor';
import { getUserDisplayNameString } from '~/utils/common/getUserDisplayNameString';
import { useCompetitorAvatar, useCompetitorDisplayName } from './TournamentCompetitorCard.hooks';

import styles from './TournamentCompetitorCard.module.scss';

export interface TournamentCompetitorCardProps {
  className?: string;
  tournamentCompetitor: TournamentCompetitor;
}

export const TournamentCompetitorCard = ({
  className,
  tournamentCompetitor,
}: TournamentCompetitorCardProps): JSX.Element => {
  const user = useAuth();
  const tournament = useTournament();
  const avatar = useCompetitorAvatar(tournamentCompetitor);
  const displayName = useCompetitorDisplayName(tournamentCompetitor);
  const isTeamTournament = tournament.competitorSize > 1;
  const userIsPlayer = !!(user && tournament.playerUserIds.includes(user._id));
  const userIsOrganizer = !!(user && tournament.organizerUserIds.includes(user._id));

  const { mutation: addPlayer } = useAddPlayerToTournamentCompetitor({
    successMessage: `Successfully joined ${tournament.title}!`,
  });
  const { mutation: removePlayer } = useRemovePlayerFromTournamentCompetitor({
    successMessage: `Successfully left ${tournament.title}!`,
  });

  const handleClickJoin = () => {
    if (!user) {
      return;
    }
    addPlayer({
      tournamentCompetitorId: tournamentCompetitor._id,
      playerUserId: user._id,
    });
  };
  const handleClickLeave = () => {
    if (!user) {
      return;
    }
    removePlayer({
      tournamentCompetitorId: tournamentCompetitor._id,
      playerUserId: user._id,
    });
  };
  return (
    <Card className={clsx(styles.TournamentCompetitorCard, className)} data-is-team={isTeamTournament}>
      <div className={styles.TournamentCompetitorCard_Avatar}>
        {avatar}
      </div>
      <div className={styles.TournamentCompetitorCard_TeamName}>
        <h3>{displayName}</h3>
        {(isTeamTournament && user && !userIsOrganizer) && (!userIsPlayer ? (
          <Button size="small" muted className={styles.TournamentCompetitorCard_JoinButton} onClick={handleClickJoin}>
            <UserPlus />
            Join
          </Button>
        ) : (
          <Button size="small" muted className={styles.TournamentCompetitorCard_JoinButton} onClick={handleClickLeave}>
            <UserMinus />
            Leave
          </Button>
        ))}
      </div>
      {isTeamTournament && (
        <>
          <Separator className={styles.TournamentCompetitorCard_Separator} />
          <div className={styles.TournamentCompetitorCard_TeamPlayers}>
            {tournamentCompetitor.players.map(({ user }, i) => (
              <div key={i} className={styles.TournamentCompetitorCard_TeamPlayers_Player}>
                <Avatar url={user?.avatarUrl} />
                {getUserDisplayNameString(user)}
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};
