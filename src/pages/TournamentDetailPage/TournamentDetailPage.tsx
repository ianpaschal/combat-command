import { useCallback, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useWindowWidth } from '@react-hook/window-size/throttled';
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
import { PageWrapper } from '~/components/PageWrapper';
import { TournamentCompetitorsProvider } from '~/components/TournamentCompetitorsProvider';
import { TournamentContextMenu } from '~/components/TournamentContextMenu';
import { TournamentProvider } from '~/components/TournamentProvider';
import { TournamentRankingsCard } from '~/pages/TournamentDetailPage/components/TournamentRankingsCard';
import { useGetTournamentCompetitorsByTournamentId } from '~/services/tournamentCompetitors';
import { useGetTournament } from '~/services/tournaments';
import {
  MAX_WIDTH,
  MIN_WIDTH_DESKTOP,
  MIN_WIDTH_TABLET,
} from '~/settings';

import { TournamentInfoCard } from './components/TournamentInfoCard';
import { TournamentPairingsCard } from './components/TournamentPairingsCard';
import { TournamentRosterCard } from './components/TournamentRosterCard';

import styles from './TournamentDetailPage.module.scss';

export const TournamentDetailPage = (): JSX.Element => {
  const windowWidth = useWindowWidth();
  const params = useParams();
  const tournamentId = params.id! as TournamentId; // Must exist or else how did we get to this route?
  const { data: tournament } = useGetTournament({ id: tournamentId });
  const { data: tournamentCompetitors } = useGetTournamentCompetitorsByTournamentId(tournamentId);

  const fitToWindow = windowWidth >= MIN_WIDTH_DESKTOP;

  // TAB STUFF
  const [searchParams, setSearchParams] = useSearchParams();
  const queryTab = searchParams.get('tab');

  const handleTabChange = useCallback((tab: string) => {
    setSearchParams({ tab }, { replace: true });
  }, [setSearchParams]);

  const showInfoSidebar = windowWidth >= MIN_WIDTH_DESKTOP;
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

  const showTabLabels = windowWidth >= MIN_WIDTH_TABLET;

  if (!tournament || !tournamentCompetitors) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={styles.TournamentDetailPage_Banner} style={tournament.bannerUrl ? {
        backgroundImage: `url(${tournament.bannerUrl}`,
        backgroundSize: 'cover',
      } : undefined}>
        <div className={styles.TournamentDetailPage_BannerContent} style={{ maxWidth: MAX_WIDTH }}>
          {tournament?.logoUrl && (
            <img className={styles.Logo} src={tournament.logoUrl} />
          )}
          <h1>{tournament.title}</h1>
        </div>
      </div>
      <PageWrapper fitToWindow={fitToWindow} removeAppBarPadding>
        <TournamentProvider tournament={tournament}>
          <TournamentCompetitorsProvider tournamentCompetitors={tournamentCompetitors}>
            <div className={styles.TournamentDetailPage_Content}>
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
                <TabsContent className={styles.TournamentDetailPage_TabsContent} value="info">
                  <TournamentInfoCard />
                </TabsContent>
                <TabsContent className={styles.TournamentDetailPage_TabsContent} value="pairings">
                  <TournamentPairingsCard />
                </TabsContent>
                <TabsContent className={styles.TournamentDetailPage_TabsContent} value="rankings">
                  <TournamentRankingsCard />
                </TabsContent>
                {/* TODO: Add match results later */}
                {/* <TabsContent className={styles.TournamentDetailPage_TabsContent} value="matchResults">
                  <TournamentDetailsCard title="Match Results">
                    Nothing here yet
                  </TournamentDetailsCard>
                </TabsContent> */}
                <TabsContent className={styles.TournamentDetailPage_TabsContent} value="roster">
                  <TournamentRosterCard />
                </TabsContent>
              </Tabs>
            </div>
          </TournamentCompetitorsProvider>
        </TournamentProvider >
      </PageWrapper >
    </>
  );
};
