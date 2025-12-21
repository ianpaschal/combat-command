import { Table } from '@ianpaschal/combat-command-components';
import clsx from 'clsx';
import { Trophy } from 'lucide-react';

import { EmptyState } from '~/components/EmptyState';
import { Spinner } from '~/components/generic/Spinner';
import { useLeague } from '~/components/LeagueProvider';
import { useGetLeagueRankingsByLeague } from '~/services/leagueRankings';
import { LeagueDetailCard } from '../LeagueDetailCard';
import { getLeagueRankingTableConfig } from './LeagueRankingsCard.utils';

import styles from './LeagueRankingsCard.module.scss';

export interface LeagueRankingsCardProps {
  className?: string;
}

export const LeagueRankingsCard = ({
  className,
}: LeagueRankingsCardProps): JSX.Element => {
  const league = useLeague();
  const { data: leagueRankings, loading } = useGetLeagueRankingsByLeague({
    leagueId: league._id,
  }, 200); // TODO: Add pagination to table
  const columns = getLeagueRankingTableConfig(league);
  const rows = leagueRankings ?? [];
  const showLoadingState = loading;
  const showEmptyState = !loading && !leagueRankings?.length;
  return (
    <LeagueDetailCard className={clsx(className)} title="Rankings">
      {showLoadingState ? (
        <div className={styles.LeagueRankingsCard_LoadingState}>
          <Spinner />
        </div>
      ) : (
        showEmptyState ? (
          <EmptyState icon={<Trophy />} />
        ) : (
          // TODO: Add pagination to table
          <Table className={styles.LeagueRankingsCard_Table} columns={columns} rows={rows} />
        )
      )}
    </LeagueDetailCard>
  );
};
