import { ReactElement, useState } from 'react';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import {
  LineChart,
  Swords,
  Trophy,
} from 'lucide-react';

import { Button } from '~/components/generic/Button';
import { PageWrapper } from '~/components/PageWrapper';
import { MIN_WIDTH_DESKTOP } from '~/settings';
import { MatchResultsCard } from './components/MatchResultsCard';
import { StatsCard } from './components/StatsCard';
import { TournamentsCard } from './components/TournamentsCard';

import styles from './DashboardPage.module.scss';

type TabKey = 'tournaments' | 'matchResults' | 'stats';

export const DashboardPage = (): JSX.Element => {
  const windowWidth = useWindowWidth();
  const isDesktop = windowWidth >= MIN_WIDTH_DESKTOP;
  const [view, setView] = useState<TabKey>('tournaments');
  const tabs: Record<TabKey, ReactElement> = {
    tournaments: <Trophy />,
    matchResults: <Swords />,
    stats: <LineChart />,
  };
  return (
    <PageWrapper title="Dashboard" fitToWindow={isDesktop} footer={!isDesktop ? (
      <div className={styles.DashboardPage_Tabs}>
        {Object.entries(tabs).map(([key, icon]) => (
          <div key={key} className={styles.DashboardPage_TabTrigger}>
            <Button
              icon={icon}
              size="large"
              variant="ghost"
              onClick={() => setView(key as TabKey)}
            />
          </div>
        ))}
      </div>
    ) : undefined}>
      <div
        className={styles.DashboardPage}
        data-orientation={isDesktop ? 'horizontal' : 'vertical'}
      >
        {(isDesktop || view === 'tournaments') && (
          <TournamentsCard className={styles.DashboardPage_Tournaments} />
        )}
        {(isDesktop || view === 'matchResults') && (
          <MatchResultsCard className={styles.DashboardPage_MatchResults} />
        )}
        {(isDesktop || view === 'stats') && (
          <StatsCard className={styles.DashboardPage_Stats} />
        )}
      </div>
    </PageWrapper>
  );
};
