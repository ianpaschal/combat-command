import { useParams } from 'react-router-dom';
import { Info, Trophy } from 'lucide-react';
import { useQueryState } from 'nuqs';

import { LeagueId } from '~/api';
import {
  Tabs,
  TabsContent,
  TabsList,
} from '~/components/generic/Tabs';
import { LeagueBanner } from '~/components/LeagueBanner';
import { LeagueProvider } from '~/components/LeagueProvider';
import { NotFoundView } from '~/components/NotFoundView';
import { PageWrapper } from '~/components/PageWrapper';
import { DeviceSize, useDeviceSize } from '~/hooks/useDeviceSize';
import { useGetLeague } from '~/services/leagues';
import { getLeagueDisplayName } from '~/utils/common/getLeagueDisplayName';
import { LeagueInfoCard } from './components/LeagueInfoCard';
import { LeagueRankingsCard } from './components/LeagueRankingsCard';

import styles from './LeagueDetailPage.module.scss';

export const LeagueDetailPage = (): JSX.Element => {
  const [deviceSize, deviceType] = useDeviceSize();
  const params = useParams();
  const leagueId = params.id! as LeagueId; // Must exist or else how did we get to this route?
  const {
    data: league,
    loading,
  } = useGetLeague({ id: leagueId });

  const [tab, setTab] = useQueryState('tab');

  const showInfoSidebar = deviceSize >= DeviceSize.Wide;
  const tabs = [
    { value: 'info', label: 'Info', icon: <Info /> },
    { value: 'rankings', label: 'Rankings', icon: <Trophy /> },
  ];
  if (showInfoSidebar) {
    tabs.splice(tabs.findIndex((tab) => tab.value === 'info'), 1);
  }
  const activeTab = !tab || tabs.findIndex((t) => t.value === tab) === -1 ? 'rankings' : tab;

  const showTabLabels = deviceSize >= DeviceSize.Default;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!league) {
    return <NotFoundView />;
  }

  return (
    <LeagueProvider league={league}>
      <PageWrapper
        banner={<LeagueBanner />}
        title={getLeagueDisplayName(league)}
        hideTitle
      >
        <div className={styles.LeagueDetailPage_Content} data-device={deviceType}>
          {showInfoSidebar && (
            <div className={styles.LeagueDetailPage_Sidebar}>
              <LeagueInfoCard />
            </div>
          )}
          <Tabs className={styles.LeagueDetailPage_Tabs} value={activeTab} onValueChange={setTab}>
            {tabs.length > 1 && (
              <div className={styles.LeagueDetailPage_TabBar}>
                <TabsList hideLabels={!showTabLabels} tabs={tabs} />
              </div>
            )}
            <TabsContent value="info">
              <LeagueInfoCard />
            </TabsContent>
            <TabsContent value="rankings">
              <LeagueRankingsCard />
            </TabsContent>
          </Tabs>
        </div>
      </PageWrapper>
    </LeagueProvider>
  );
};
