import { ReactElement, useState } from 'react';
import clsx from 'clsx';
import { Trophy } from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { EmptyState } from '~/components/EmptyState';
import { InputSelect } from '~/components/generic/InputSelect';
import { Table } from '~/components/generic/Table';
import { useTournamentCompetitors } from '~/components/TournamentCompetitorsProvider';
import { useTournament } from '~/components/TournamentProvider';
import { getTournamentRankingTableConfig, RankingRow } from '~/pages/TournamentDetailPage/components/TournamentRankingsCard/TournamentRankingsCard.utils';
import { useGetTournamentRankings } from '~/services/tournaments';
import { getLastVisibleTournamentRound } from '~/utils/common/getLastVisibleTournamentRound';
import { getRoundOptions } from '~/utils/common/getRoundOptions';
import { TournamentDetailCard } from '../TournamentDetailCard';

import styles from './TournamentRankingsCard.module.scss';

export interface TournamentRankingsCardProps {
  className?: string;
}

export const TournamentRankingsCard = ({
  className,
}: TournamentRankingsCardProps): JSX.Element => {
  const tournament = useTournament();
  const user = useAuth();
  const competitors = useTournamentCompetitors();
  const lastVisibleRound = getLastVisibleTournamentRound(tournament, user);
  const [round, setRound] = useState<number>(lastVisibleRound);
  const [view, setView] = useState<'competitors' | 'players'>('competitors');

  const { data: rankings, loading } = useGetTournamentRankings({
    tournamentId: tournament._id,
    round,
  });

  const columns = getTournamentRankingTableConfig({
    view,
    tournament,
    competitors,
  });
  // TODO: Move rows into the config util
  const competitorRows: RankingRow[] = (rankings?.competitors || []).map((competitor) => ({
    id: competitor.id,
    rank: competitor.rank,
    stats: competitor.stats,
  }));
  const playerRows: RankingRow[] = (rankings?.players || []).map((player) => ({
    id: player.id,
    rank: player.rank,
    stats: player.stats,
  }));
  const rows = view === 'players' ? playerRows : competitorRows;

  const showEmptyState = tournament.lastRound === undefined || !(rankings?.[view] ?? []).length;
  const showLoadingState = loading;

  const roundOptions = getRoundOptions(lastVisibleRound);
  const viewOptions = [
    { label: 'Players', value: 'players' },
    { label: 'Teams', value: 'competitors' },
  ];

  const getPrimaryButtons = (): ReactElement[] => [
    ...(tournament.useTeams ? [
      <InputSelect
        options={viewOptions}
        value={view}

        onChange={(selected) => setView(selected as 'players' | 'competitors')}
        disabled={showLoadingState || showEmptyState}
      />,
    ] : []),
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
      title="Rankings"
      buttons={getPrimaryButtons()}
    >
      {showLoadingState ? (
        <div className={styles.TournamentRankingsCard_EmptyState}>
          Loading...
        </div>
      ) : (
        showEmptyState ? (
          <EmptyState icon={<Trophy />} />
        ) : (
          <Table columns={columns} rows={rows} rowClassName={styles.TournamentRankingsCard_Row} />
        )
      )}
    </TournamentDetailCard>
  );
};
