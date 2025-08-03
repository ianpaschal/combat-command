import { Tournament, UserId } from '~/api';
import { useGetTournamentCompetitorsByTournament } from '~/services/tournamentCompetitors';
import { useGetTournamentRankings } from '~/services/tournaments';
import { getTournamentCompetitorDisplayName } from '~/utils/common/getTournamentCompetitorDisplayName';

import styles from './UserTournamentItem.module.scss';

export interface UserTournamentItemProps {
  userId: UserId;
  tournament: Tournament;
}

export const UserTournamentItem = ({
  userId,
  tournament,
}: UserTournamentItemProps): JSX.Element => {
  const { data: rankings } = useGetTournamentRankings({
    tournamentId: tournament._id,
    round: tournament.roundCount - 1,
  });
  const { data: competitors } = useGetTournamentCompetitorsByTournament({
    tournamentId: tournament._id,
  });
  const competitor = (competitors ?? []).find((c) => c.players.find((p) => p.user._id === userId));
  return (
    <div className={styles.UserTournamentCard}>
      <div className={styles.UserTournamentCard_LogoWrapper}>
        <img src={tournament.logoUrl} className={styles.UserTournamentCard_Logo} />
      </div>
      <h2>{tournament.title}</h2>
      {tournament.useTeams && (
        <p>{getTournamentCompetitorDisplayName(competitor)}</p>
      )}
    </div>
  );
};
