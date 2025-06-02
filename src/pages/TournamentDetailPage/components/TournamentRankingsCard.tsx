import { useState } from 'react';
import clsx from 'clsx';

import { InputSelect } from '~/components/generic/InputSelect';
import { Table } from '~/components/generic/Table';
import { useTournamentCompetitors } from '~/components/TournamentCompetitorsProvider';
import { useTournament } from '~/components/TournamentProvider';
import { getTournamentRankingTableConfig, RankingRow } from '~/pages/TournamentDetailPage/components/TournamentRankingsCard.utils';
import { useGetTournamentRankings } from '~/services/tournaments';

import { TournamentDetailsCard } from './TournamentDetailsCard';

import styles from './TournamentRankingsCard.module.scss';

export interface TournamentRankingsCardProps {
  className?: string;
}

export const TournamentRankingsCard = ({
  className,
}: TournamentRankingsCardProps): JSX.Element => {
  const { _id: tournamentId, lastRound, useTeams, rankingFactors } = useTournament();
  const competitors = useTournamentCompetitors();
  const [round, setRound] = useState<number>(lastRound ?? 0);
  const [view, setView] = useState<'competitors' | 'players'>('competitors');

  const { data: rankings, loading } = useGetTournamentRankings({
    tournamentId,
    round,
  });

  const columns = getTournamentRankingTableConfig({
    view,
    useTeams,
    rankingFactors,
    competitors,
  });
  // TODO: Move rows into the config util
  const competitorRows: RankingRow[] = (rankings?.competitors || []).map((competitor) => ({
    id: competitor.tournamentCompetitorId,
    rank: competitor.rank,
    stats: competitor.stats,
  }));
  const playerRows: RankingRow[] = (rankings?.players || []).map((player) => ({
    id: player.userId,
    rank: player.rank,
    stats: player.stats,
  }));
  const rows = view === 'players' ? playerRows : competitorRows;

  const roundOptions = Array.from({ length: (lastRound ?? 0) + 1 }, (_, i) => i).map((round) => ({
    label: `Round ${round + 1}`,
    value: round,
  }));
  const viewOptions = [
    { label: 'Players', value: 'players' },
    { label: 'Teams', value: 'competitors' },
  ];

  const showEmptyState = !lastRound;
  const showLoadingState = loading;

  return (
    <TournamentDetailsCard
      className={clsx(className)}
      title="Rankings"
      buttons={[
        ...(useTeams ? [
          <InputSelect
            options={viewOptions}
            value={view}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            onChange={(selected) => setView(selected)}
            disabled={showLoadingState || showEmptyState}
          />,
        ] : []),
        <InputSelect
          options={roundOptions}
          value={round}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onChange={(selected) => setRound(selected)}
          disabled={showLoadingState || showEmptyState}
        />,
      ]}
    >
      {showLoadingState ? (
        <div className={styles.TournamentRankingsCard_EmptyState}>
          Loading...
        </div>
      ) : (
        showEmptyState ? (
          <div className={styles.TournamentRankingsCard_EmptyState}>
            Nothing to show yet.
          </div>
        ) : (
          <Table columns={columns} rows={rows} rowClassName={styles.TournamentRankingsCard_Row} />
        )
      )}
    </TournamentDetailsCard >
  );
};
