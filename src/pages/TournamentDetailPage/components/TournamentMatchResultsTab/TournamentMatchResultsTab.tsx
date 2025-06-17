import { ReactElement, useState } from 'react';
import clsx from 'clsx';

import { InputSelect } from '~/components/generic/InputSelect';
import { TabsContent } from '~/components/generic/Tabs';
import { MatchResultCard } from '~/components/MatchResultCard';
import { useTournament } from '~/components/TournamentProvider';
import { TournamentDetailsCard } from '~/pages/TournamentDetailPage/components/TournamentDetailsCard';
import { useGetMatchResultsByTournamentRound } from '~/services/matchResults';

import styles from './TournamentMatchResultsTab.module.scss';

export interface TournamentMatchResultsTabProps {
  className?: string;
  value: string;
}

export const TournamentMatchResultsTab = ({
  className,
  value,
}: TournamentMatchResultsTabProps): JSX.Element => {
  const tournament = useTournament();
  const [round, setRound] = useState<number>(tournament.lastRound ?? 0);
  const { data: matchResults, loading } = useGetMatchResultsByTournamentRound({
    tournamentId: tournament._id,
    round,
  });

  const showEmptyState = !matchResults?.length;
  const showLoadingState = loading;

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
    <TabsContent value={value}>
      <TournamentDetailsCard
        className={clsx(className)}
        title="Match Results"
        buttons={getPrimaryButtons()}
      >
        {showLoadingState ? (
          <div className={styles.TournamentMatchResultsTab_EmptyState}>
            Loading...
          </div>
        ) : (
          showEmptyState ? (
            <div className={styles.TournamentMatchResultsTab_EmptyState}>
              Nothing to show yet.
            </div>
          ) : (
            <div className={styles.TournamentMatchResultsTab_MatchResults}>
              {(matchResults || []).map((matchResult) => (
                <MatchResultCard key={matchResult._id} matchResult={matchResult} />
              ))}
            </div>
          )
        )}
      </TournamentDetailsCard>
    </TabsContent >
  );
};
