import { useCallback, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Info,
  LineChart,
  Swords,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';

import { TournamentId } from '~/api';
import {
  Tabs,
  TabsContent,
  TabsList,
} from '~/components/generic/Tabs';
import { NotFoundView } from '~/components/NotFoundView';
import { PageWrapper } from '~/components/PageWrapper';
import { TournamentBanner } from '~/components/TournamentBanner';
import { TournamentCompetitorsProvider } from '~/components/TournamentCompetitorsProvider';
import { TournamentContextMenu } from '~/components/TournamentProvider';
import { TournamentProvider } from '~/components/TournamentProvider';
import { DeviceSize, useDeviceSize } from '~/hooks/useDeviceSize';
import { useGetTournamentCompetitorsByTournament } from '~/services/tournamentCompetitors';
import { useGetTournament } from '~/services/tournaments';
import { TournamentInfoCard } from './components/TournamentInfoCard';
import { TournamentMatchResultsCard } from './components/TournamentMatchResultsCard';
import { TournamentPairingsCard } from './components/TournamentPairingsCard';
import { TournamentRankingsCard } from './components/TournamentRankingsCard';
import { TournamentRosterCard } from './components/TournamentRosterCard';
import { TournamentStatsCard } from './components/TournamentStatsCard';

import styles from './TournamentDetailPage.module.scss';

export const TournamentDetailPage = (): JSX.Element => {
  const [deviceSize, deviceType] = useDeviceSize();
  const params = useParams();
  const tournamentId = params.id! as TournamentId; // Must exist or else how did we get to this route?
  const {
    data: tournament,
    loading: tournamentLoading,
  } = useGetTournament({ id: tournamentId });
  const {
    data: tournamentCompetitors,
    loading: tournamentCompetitorsLoading,
  } = useGetTournamentCompetitorsByTournament({ tournamentId });

  const [searchParams, setSearchParams] = useSearchParams();
  const queryTab = searchParams.get('tab');

  const handleTabChange = useCallback((tab: string) => {
    setSearchParams({ tab }, { replace: true });
  }, [setSearchParams]);

  const showInfoSidebar = deviceSize >= DeviceSize.Wide;
  const tabs = [
    { value: 'info', label: 'Info', icon: <Info /> },
    { value: 'roster', label: 'Roster', icon: <Users /> },
    { value: 'pairings', label: 'Pairings', icon: <Zap /> },
    { value: 'rankings', label: 'Rankings', icon: <Trophy /> },
    { value: 'matchResults', label: 'Match Results', icon: <Swords /> },
    { value: 'stats', label: 'Stats', icon: <LineChart /> },
  ];
  if (showInfoSidebar) {
    tabs.splice(tabs.findIndex((tab) => tab.value === 'info'), 1);
  }
  const getDefaultTab = (): string => {
    if (tournament?.status === 'archived') {
      return 'rankings';
    }
    if (tournament?.status === 'active') {
      if (tournament.currentRound !== undefined) {
        return 'pairings';
      } else {
        return 'rankings';
      }
    }
    if (tournament?.status === 'published') {
      if (showInfoSidebar) {
        return 'roster';
      }
      return 'info';
    }
    return 'roster';
  };
  const activeTab = !queryTab || tabs.findIndex((tab) => tab.value === queryTab) === -1 ? getDefaultTab() : queryTab;

  const loading = tournamentLoading || tournamentCompetitorsLoading;

  useEffect(() => {
    /* Only do this when loading. Otherwise since the first render happens before we know the
     * tournament status, getDefaultTab ALWAYS returns 'roster'. */
    if (activeTab !== queryTab && !loading) {
      handleTabChange(activeTab);
    }
  }, [activeTab, queryTab, handleTabChange, loading]);

  const showTabLabels = deviceSize >= DeviceSize.Default;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!tournament || !tournamentCompetitors) {
    return <NotFoundView />;
  }

  return (
    <TournamentProvider tournament={tournament}>
      <TournamentCompetitorsProvider tournamentCompetitors={tournamentCompetitors}>
        <PageWrapper
          banner={<TournamentBanner />}
          title={tournament.title}
          hideTitle
        >
          <div className={styles.TournamentDetailPage_Content} data-device={deviceType}>
            {showInfoSidebar && (
              <div className={styles.TournamentDetailPage_Sidebar}>
                <TournamentInfoCard />
              </div>
            )}
            <Tabs className={styles.TournamentDetailPage_Tabs} value={activeTab} onValueChange={handleTabChange}>
              <div className={styles.TournamentDetailPage_TabBar}>
                {tabs.length > 1 && (
                  <TabsList hideLabels={!showTabLabels} tabs={tabs} />
                )}
                <TournamentContextMenu tournament={tournament} size="large" />
              </div>
              <TabsContent value="info">
                <TournamentInfoCard />
              </TabsContent>
              <TabsContent value="pairings">
                <TournamentPairingsCard />
              </TabsContent>
              <TabsContent value="rankings">
                <TournamentRankingsCard />
              </TabsContent>
              <TabsContent value="matchResults">
                <TournamentMatchResultsCard />
              </TabsContent>
              <TabsContent value="roster">
                <TournamentRosterCard />
              </TabsContent>
              <TabsContent value="stats">
                <TournamentStatsCard />
              </TabsContent>
            </Tabs>
          </div>
        </PageWrapper>
      </TournamentCompetitorsProvider>
    </TournamentProvider>
  );
};
