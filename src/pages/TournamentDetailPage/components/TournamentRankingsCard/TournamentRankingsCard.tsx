import {
  ReactElement,
  useMemo,
  useState,
} from 'react';
import clsx from 'clsx';
import { Trophy } from 'lucide-react';

import { TournamentRegistration } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { EmptyState } from '~/components/EmptyState';
import { InputSelect } from '~/components/generic/InputSelect';
import { Table } from '~/components/generic/Table';
import { useTournamentCompetitors } from '~/components/TournamentCompetitorsProvider';
import { useTournament } from '~/components/TournamentProvider';
import { getTournamentRankingTableConfig, RankingRow } from '~/pages/TournamentDetailPage/components/TournamentRankingsCard/TournamentRankingsCard.utils';
import { useGetTournamentResultsByRound } from '~/services/tournamentResults';
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
  const [view, setView] = useState<'competitors' | 'registrations'>('competitors');

  const { data: results, loading } = useGetTournamentResultsByRound({
    tournamentId: tournament._id,
    round,
  });

  const registrations: TournamentRegistration[] = useMemo(() => competitors.reduce((acc, c) => [
    ...acc,
    ...c.registrations,
  ], [] as TournamentRegistration[]), [
    competitors,
  ]);

  const columns = getTournamentRankingTableConfig({
    view,
    tournament,
    competitors,
    registrations,
  });
  // TODO: Move rows into the config util
  const competitorRows: RankingRow[] = (results?.competitors || []).map((competitor) => ({
    id: competitor.id,
    rank: competitor.rank,
    rankingFactors: competitor.rankingFactors,
  }));
  const registrationRows: RankingRow[] = (results?.registrations || []).map((registration) => ({
    id: registration.id,
    rank: registration.rank,
    rankingFactors: registration.rankingFactors,
  }));
  const rows = view === 'registrations' ? registrationRows : competitorRows;

  const showEmptyState = tournament.lastRound === undefined || !(results?.[view] ?? []).length;
  const showLoadingState = loading;

  const roundOptions = getRoundOptions(lastVisibleRound);
  const viewOptions = [
    { label: 'Players', value: 'registrations' },
    { label: 'Teams', value: 'competitors' },
  ];

  const getPrimaryButtons = (): ReactElement[] => [
    ...(tournament.useTeams ? [
      <InputSelect
        options={viewOptions}
        value={view}

        onChange={(selected) => setView(selected as 'registrations' | 'competitors')}
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
          <Table className={styles.TournamentRankingsCard_Table} columns={columns} rows={rows} />
        )
      )}
    </TournamentDetailCard>
  );
};
