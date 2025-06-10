import { useCallback, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Info,
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
import { TournamentCompetitorsProvider } from '~/components/TournamentCompetitorsProvider';
import { TournamentContextMenu } from '~/components/TournamentContextMenu';
import { TournamentProvider } from '~/components/TournamentProvider';
import { DeviceSize, useDeviceSize } from '~/hooks/useDeviceSize';
import { useGetTournamentCompetitorsByTournamentId } from '~/services/tournamentCompetitors';
import { useGetTournament } from '~/services/tournaments';
import { TournamentDetailBanner } from './components/TournamentDetailBanner';
import { TournamentInfoCard } from './components/TournamentInfoCard';
import { TournamentPairingsCard } from './components/TournamentPairingsCard';
import { TournamentRankingsCard } from './components/TournamentRankingsCard';
import { TournamentRosterCard } from './components/TournamentRosterCard';

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
  } = useGetTournamentCompetitorsByTournamentId({ tournamentId });

  const [searchParams, setSearchParams] = useSearchParams();
  const queryTab = searchParams.get('tab');

  const handleTabChange = useCallback((tab: string) => {
    setSearchParams({ tab }, { replace: true });
  }, [setSearchParams]);

  const showInfoSidebar = deviceSize >= DeviceSize.Wide;
  const tabs = [
    { value: 'info', label: 'Info', icon: <Info /> },
    { value: 'pairings', label: 'Pairings', icon: <Zap /> },
    { value: 'rankings', label: 'Rankings', icon: <Trophy /> },
    // TODO: Add match results later
    // { value: 'matchResults', label: 'Match Results', icon: <Swords /> },
    { value: 'roster', label: 'Roster', icon: <Users /> },
  ];
  if (showInfoSidebar) {
    tabs.splice(tabs.findIndex((tab) => tab.value === 'info'), 1);
  }
  const activeTab = !queryTab || tabs.findIndex((tab) => tab.value === queryTab) === -1 ? tabs[0].value : queryTab;

  useEffect(() => {
    if (activeTab !== queryTab) {
      handleTabChange(activeTab);
    }
  }, [activeTab, queryTab, handleTabChange]);

  const showTabLabels = deviceSize >= DeviceSize.Default;

  const loading = tournamentLoading || tournamentCompetitorsLoading;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!tournament || !tournamentCompetitors) {
    return <NotFoundView />;
  }

  return (
    <TournamentProvider tournament={tournament}>
      <TournamentCompetitorsProvider tournamentCompetitors={tournamentCompetitors}>
        <PageWrapper banner={<TournamentDetailBanner />}>
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
                <TournamentContextMenu variant="primary" size="large" />
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
              {/* TODO: Add match results later */}
              {/* <TabsContent className={styles.TournamentDetailPage_TabsContent} value="matchResults">
                  <TournamentDetailsCard title="Match Results">
                    Nothing here yet
                  </TournamentDetailsCard>
                </TabsContent> */}
              <TabsContent value="roster">
                <TournamentRosterCard />
              </TabsContent>
            </Tabs>
          </div>
        </PageWrapper>
      </TournamentCompetitorsProvider>
    </TournamentProvider>
  );
};
