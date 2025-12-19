import { Trophy } from 'lucide-react';

import { EmptyState } from '~/components/EmptyState';
import { Spinner } from '~/components/generic/Spinner';
import { LeagueCard } from '~/components/LeagueCard';
import { PageWrapper } from '~/components/PageWrapper';
import { useGetLeagues } from '~/services/leagues';

import styles from './LeaguesPage.module.scss';

export const LeaguesPage = (): JSX.Element => {
  const { data: leagues, loading } = useGetLeagues({});
  const showLoadingState = loading;
  const showEmptyState = !loading && !leagues?.length;
  return (
    <PageWrapper title="Leagues">
      <div className={styles.LeaguesPage_Content}>
        {showLoadingState ? (
          <div className={styles.LeaguesPage_LoadingState}>
            <Spinner />
          </div>
        ) : (
          showEmptyState ? (
            <EmptyState icon={<Trophy />} />
          ) : (
            (leagues ?? []).map((league) => (
              <LeagueCard key={league._id} league={league} />
            ))
          )
        )}
      </div>
    </PageWrapper>
  );
};
