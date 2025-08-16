import clsx from 'clsx';

import { useAuth } from '~/components/AuthProvider';
import { Spinner } from '~/components/generic/Spinner';
import { ActiveTournament } from '~/pages/DashboardPage/components/ActiveTournament';
import { TournamentsList } from '~/pages/DashboardPage/components/TournamentsList';
import { useGetActiveTournamentPairingsByUser } from '~/services/tournamentPairings';
import { useGetTournamentRankings, useGetTournaments } from '~/services/tournaments';

import styles from './TournamentsCard.module.scss';

export interface TournamentsCardProps {
  className?: string;
}

export const TournamentsCard = ({
  className,
}: TournamentsCardProps): JSX.Element => {
  const user = useAuth();

  const {
    data: tournaments,
    loading: tournamentsLoading,
  } = useGetTournaments({});

  const upcomingTournaments = (tournaments ?? []).filter((tournament) => (
    tournament.status === 'published'
  ));

  const liveTournament = (tournaments ?? []).filter((tournament) => (
    tournament.status === 'active' && user && [
      ...tournament.playerUserIds,
      ...tournament.organizers.map((r) => r.userId),
    ].includes(user._id)
  )).at(-1);

  const {
    data: rankings,
    loading: rankingsLoading,
  } = useGetTournamentRankings(liveTournament ? {
    tournamentId: liveTournament._id,
    round: liveTournament.currentRound ?? liveTournament.nextRound ?? 0,
  } : 'skip');
  const {
    data: pairings,
    loading: pairingsLoading,
  } = useGetActiveTournamentPairingsByUser(user && liveTournament ? {
    userId: user._id,
    round: liveTournament.currentRound ?? liveTournament.nextRound,
  } : 'skip');
  const pairing = pairings?.at(-1);

  const showLoading = tournamentsLoading || pairingsLoading || rankingsLoading;

  return (
    <div className={clsx(styles.TournamentsCard, className)}>
      {showLoading ? (
        <div className={styles.TournamentsCard_Loading}>
          <Spinner /> Loading...
        </div>
      ) : (
        liveTournament ? (
          <ActiveTournament
            tournament={liveTournament}
            pairing={pairing}
            rankedCompetitors={rankings?.competitors}
          />
        ) : (
          <TournamentsList tournaments={upcomingTournaments} />
        )
      )}
    </div>
  );
};
