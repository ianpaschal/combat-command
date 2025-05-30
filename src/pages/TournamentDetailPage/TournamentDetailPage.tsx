import { useCallback, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import {
  Info,
  Swords,
  Timer,
  Trophy,
  Users,
} from 'lucide-react';

import { TournamentId } from '~/api';
import { Animate } from '~/components/generic/Animate';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/generic/Tabs';
import { PageWrapper } from '~/components/PageWrapper';
import { TournamentContextMenu } from '~/components/TournamentContextMenu';
import { TournamentProvider } from '~/components/TournamentProvider';
import { useFetchTournament } from '~/services/tournaments/useFetchTournament';
import {
  MAX_WIDTH,
  MIN_WIDTH_DESKTOP,
  MIN_WIDTH_TABLET,
} from '~/settings';

import { TournamentActiveRoundCard } from './components/TournamentActiveRoundCard';
import { TournamentDetailsCard } from './components/TournamentDetailsCard';
import { TournamentInfoCard } from './components/TournamentInfoCard';
import { TournamentRosterCard } from './components/TournamentRosterCard';

import styles from './TournamentDetailPage.module.scss';

export const TournamentDetailPage = (): JSX.Element => {
  const windowWidth = useWindowWidth();
  const params = useParams();
  const tournamentId = params.id! as TournamentId; // Must exist or else how did we get to this route?
  const { data: tournament } = useFetchTournament(tournamentId);

  const fitToWindow = windowWidth >= MIN_WIDTH_DESKTOP;

  // TAB STUFF
  const [searchParams, setSearchParams] = useSearchParams();
  const queryTab = searchParams.get('tab');

  const handleTabChange = useCallback((tab: string) => {
    setSearchParams({ tab }, { replace: true });
  }, [setSearchParams]);

  const showInfoSidebar = windowWidth >= MIN_WIDTH_DESKTOP;
  const showActiveRoundSidebar = false;

  const visibleTabs = ['info', 'activeRound', 'rankings', 'matchResults', 'roster'];
  if (showInfoSidebar) {
    visibleTabs.splice(visibleTabs.indexOf('info'), 1);
  }
  if (showActiveRoundSidebar) {
    visibleTabs.splice(visibleTabs.indexOf('activeRound'), 1);
  }
  if (tournament?.currentRound === undefined) {
    visibleTabs.splice(visibleTabs.indexOf('activeRound'), 1);
    visibleTabs.splice(visibleTabs.indexOf('rankings'), 1);
    visibleTabs.splice(visibleTabs.indexOf('matchResults'), 1);
  }

  const activeTab = !queryTab || !visibleTabs.includes(queryTab) ? visibleTabs[0] : queryTab;

  useEffect(() => {
    if (activeTab !== queryTab) {
      handleTabChange(activeTab);
    }
  }, [activeTab, queryTab, handleTabChange]);

  const showTabLabels = windowWidth >= MIN_WIDTH_TABLET;

  if (!tournament) {
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
          <div className={styles.TournamentDetailPage_Content}>
            {showInfoSidebar && (
              <div className={styles.TournamentDetailPage_Sidebar}>
                <TournamentInfoCard />
              </div>
            )}
            <Tabs className={styles.TournamentDetailPage_Tabs} value={activeTab} onValueChange={handleTabChange}>
              <div className={styles.TournamentDetailPage_TabBar}>
                {visibleTabs.length > 1 && (
                  <TabsList>
                    <Animate show={visibleTabs.includes('info')}>
                      <TabsTrigger value="info">
                        <Info />
                        {showTabLabels && (
                          'Info'
                        )}
                      </TabsTrigger>
                    </Animate>
                    <Animate show={visibleTabs.includes('activeRound')}>
                      <TabsTrigger value="activeRound">
                        <Timer />
                        {showTabLabels && (
                          'Active Round'
                        )}
                      </TabsTrigger>
                    </Animate>
                    <Animate show={visibleTabs.includes('rankings')}>
                      <TabsTrigger value="rankings">
                        <Trophy />
                        {showTabLabels && (
                          'Rankings'
                        )}
                      </TabsTrigger>
                    </Animate>
                    <Animate show={visibleTabs.includes('matchResults')}>
                      <TabsTrigger value="matchResults">
                        <Swords />
                        {showTabLabels && (
                          'Match Results'
                        )}
                      </TabsTrigger>
                    </Animate>
                    <Animate show={visibleTabs.includes('roster')}>
                      <TabsTrigger value="roster">
                        <Users />
                        {showTabLabels && (
                          'Roster'
                        )}
                      </TabsTrigger>
                    </Animate>
                  </TabsList>
                )}
                <TournamentContextMenu variant="primary" />
              </div>
              <TabsContent className={styles.TournamentDetailPage_TabsContent} value="info">
                <TournamentInfoCard />
              </TabsContent>
              <TabsContent className={styles.TournamentDetailPage_TabsContent} value="activeRound">
                <TournamentActiveRoundCard />
              </TabsContent>
              <TabsContent className={styles.TournamentDetailPage_TabsContent} value="rankings">
                <TournamentDetailsCard title="Rankings">
                  Nothing here yet
                </TournamentDetailsCard>
              </TabsContent>
              <TabsContent className={styles.TournamentDetailPage_TabsContent} value="matchResults">
                <TournamentDetailsCard title="Match Results">
                  Nothing here yet
                </TournamentDetailsCard>
              </TabsContent>
              <TabsContent className={styles.TournamentDetailPage_TabsContent} value="roster">
                <TournamentRosterCard />
              </TabsContent>
            </Tabs>
          </div>
        </TournamentProvider>
      </PageWrapper>
    </>
  );
};
