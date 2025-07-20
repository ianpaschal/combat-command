import { ReactElement, useState } from 'react';
import clsx from 'clsx';
import { Swords } from 'lucide-react';

import { EmptyState } from '~/components/EmptyState';
import { InputSelect } from '~/components/generic/InputSelect';
import { MatchResultCard } from '~/components/MatchResultCard';
import { useTournament } from '~/components/TournamentProvider';
import { useGetMatchResultsByTournamentRound } from '~/services/matchResults';
import { TournamentDetailCard } from '../TournamentDetailCard';

import styles from './TournamentMatchResultsCard.module.scss';

export interface TournamentMatchResultsCardProps {
  className?: string;
}

export const TournamentMatchResultsCard = ({
  className,
}: TournamentMatchResultsCardProps): JSX.Element => {
  const tournament = useTournament();
  const [round, setRound] = useState<number>(tournament.lastRound ?? 0);
  const { data: matchResults, loading } = useGetMatchResultsByTournamentRound({
    tournamentId: tournament._id,
    round,
  });

  const showLoadingState = loading;
  const showEmptyState = !loading && !matchResults?.length;

  const getRoundIndexes = (): number[] => {
    if (tournament.lastRound !== undefined) {
      return Array.from({ length: tournament.lastRound + 1 }, (_, i) => i);
    }
    return [0];
  };
  const roundOptions = getRoundIndexes().map((round) => ({
    label: `Round ${round + 1}`,
    value: round,
  }));

  const getPrimaryButtons = (): ReactElement[] | undefined => [
    <InputSelect
      options={roundOptions}
      value={round}
      onChange={(selected) => setRound(selected as number)}
      disabled={showLoadingState || showEmptyState}
    />,
  ];

  return (
    <TournamentDetailCard
      className={clsx(className)}
      title="Match Results"
      buttons={getPrimaryButtons()}
    >
      {showLoadingState ? (
        <div className={styles.TournamentMatchResultsCard_EmptyState}>
          Loading...
        </div>
      ) : (
        showEmptyState ? (
          <EmptyState icon={<Swords />} />
        ) : (
          <div className={styles.TournamentMatchResultsCard_MatchResults}>
            {(matchResults || []).map((matchResult) => (
              <MatchResultCard key={matchResult._id} matchResult={matchResult} />
            ))}
          </div>
        )
      )}
    </TournamentDetailCard>
  );
};
