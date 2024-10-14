import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import {
  Cog,
  Plus,
  UserRoundPlus,
} from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { CheckInMatchDialog } from '~/components/CheckInMatchDialog';
import { FloatingActionButton } from '~/components/FloatingActionButton';
import { FowV4RankingsTable } from '~/components/FowV4RankingsTable/FowV4RankingsTable';
import { Card } from '~/components/generic/Card';
import { InputSelect } from '~/components/generic/InputSelect';
import { Label } from '~/components/generic/Label';
import { ScrollArea } from '~/components/generic/ScrollArea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/generic/Tabs';
import { ManageTournamentDrawer } from '~/components/ManageTournamentDrawer';
import { ManageTournamentMenu } from '~/components/ManageTournamentMenu';
import { MatchResultCard } from '~/components/MatchResultCard';
import { PageWrapper } from '~/components/PageWrapper';
import { TournamentCard } from '~/components/TournamentCard/TournamentCard';
import { TournamentRegistrationsTable } from '~/components/TournamentRegistrationsTable';
import { TournamentMatchResultsSection } from '~/pages/TournamentDetailPage/TournamentMatchResultsSection';
import { TournamentPairingsSection } from '~/pages/TournamentDetailPage/TournamentPairingsSection';
import { TournamentRoundTimer } from '~/pages/TournamentDetailPage/TournamentRoundTimer';
import { MIN_WIDTH_DESKTOP } from '~/settings';
import { TournamentRecord } from '~/types/Tournament';
import { bem } from '~/utils/componentLib/bem';

import './TournamentDetailPage.scss';

const cn = bem('TournamentDetailPage');

export const TournamentDetailPage = (): JSX.Element => {
  const user = useAuth();
  const params = useParams();
  const tournamentId = params.id!; // Must exist or else how did we get to this route?

  const tournament: TournamentRecord = {
    id: 'dd616369-917c-4506-a017-ba3a8e503eda',
    created_at: 'foo',
    status: 'active',
    competitor_count: 21,
    competitor_groups: [{ name: 'All Players', size: 21 }],
    competitor_size: 3,
    current_round: 2,
    description: 'Our yearly Flames of war tournament this time hosted at the Bastogne War Museum 95 points MW ',
    end_date: '2024-11-10',
    end_time: '17:00',
    game_system_id: 'aec41143-341b-4da3-aef6-7cca7beb44a4',
    location: 'Bastogne, BE',
    logo_url: '',
    organizer_ids: [user?.id || ''],
    registrations_open: true,
    round_count: 5,
    rules_pack_url: 'https://drive.google.com/file/d/1rtX-xqkbHxgHEe-Ggd1msqclb5HdWJ8C',
    start_date: '2024-11-09',
    start_time: '8:00',
    title: 'FOW Belgian Nationals 2024',
    use_national_teams: false,
    registrations_close_at: 'foo',
    game_system_config: {
      points: 100,
      era: 'lw',
      lessons_from_the_front_version: '2024-03',
      mission_pack_version: '2024-06',
      allowed_books: [],
    },
    ranking_factors: [],
    pairing_method: 'swiss',
  };

  const [tab, setTab] = useState<string>('rankings');

  const isDesktop = useWindowWidth() >= MIN_WIDTH_DESKTOP;

  const isOrganizer = user && tournament.organizer_ids.includes(user.id);

  const isTournamentActive = tournament.status === 'active';
  const isRoundActive = isTournamentActive && tournament.current_round !== undefined;

  const isOverviewCardVisible = !isRoundActive && isDesktop;

  useEffect(() => {
    // If you are in the overview tab and overview would become visible by default, switch tabs
    if (tab === 'overview' && isOverviewCardVisible) {
      setTab('rankings');
    }
  }, [tab, isOverviewCardVisible]);

  // Fast-action buttons:
  const showRegisterButton = tournament.registrations_open && !isOrganizer;
  const showAddMatchResultButton = tournament.status === 'active' && !isOrganizer && tournament.current_round !== undefined;
  const showManageButton = isOrganizer;

  return (
    <PageWrapper title={tournament.title} showBackButton fitToWindow>
      <Tabs className={'TournamentDetailPage'} value={tab} onValueChange={setTab}>
        {(isRoundActive || isOverviewCardVisible) && (
          <div className={cn('SecondarySection')}>
            {isRoundActive && (
              <>
                <TournamentRoundTimer className={cn('RoundTimerSection')} />
                {isDesktop && (
                  <div className={cn('LiveMatchResults')}>
                    <h2>Match Results</h2>
                    <div className="LiveMatchResultItemList">
                      <MatchResultCard />
                      <MatchResultCard />
                      <MatchResultCard />
                      <MatchResultCard />
                      <MatchResultCard />
                      <MatchResultCard />
                      <MatchResultCard />
                    </div>
                  </div>
                )}
              </>
            )}
            {isOverviewCardVisible && (
              <Card className={cn('OverviewCard')} disablePadding>
                <TournamentCard tournament={tournament} expanded />
              </Card>
            )}
          </div>
        )}
        <div className={cn('PrimarySection')}>
          <TabsList width="min" className={cn('Toolbar')}>
            {(isRoundActive || !isDesktop) && (
              <TabsTrigger value="overview">Overview</TabsTrigger>
            )}
            <TabsTrigger value="rankings">Rankings</TabsTrigger>
            <TabsTrigger value="pairings">Pairings</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
          </TabsList>
          <TabsContent value="registrations" className={cn('TabsContentSection')}>
            <Card disablePadding>
              <TournamentRegistrationsTable />
            </Card>
          </TabsContent>
          <TabsContent value="overview" className={cn('TabsContentSection')}>
            <Card disablePadding>
              <TournamentCard tournament={tournament} expanded />
            </Card>
          </TabsContent>
          <TabsContent value="rankings" className={cn('TabsContentSection')}>
            <Card className={cn('RankingsCard')} title="Rankings">
              <FowV4RankingsTable />
            </Card>
          </TabsContent>
          <TabsContent value="pairings" className={cn('TabsContentSection')}>
            <TournamentPairingsSection />
          </TabsContent>
          <TabsContent value="matches" className={cn('TabsContentSection')}>
            <TournamentMatchResultsSection />
          </TabsContent>
        </div>
      </Tabs>
      {showRegisterButton && (
        <FloatingActionButton>
          <UserRoundPlus />
        </FloatingActionButton>
      )}
      {showAddMatchResultButton && (
        <CheckInMatchDialog tournamentId={tournamentId}>
          <FloatingActionButton>
            <Plus />
          </FloatingActionButton>
        </CheckInMatchDialog>
      )}
      {showManageButton && (
        <ManageTournamentMenu
          tournament={tournament}
          trigger={(
            <FloatingActionButton>
              <Cog />
            </FloatingActionButton>
          )}
        />
      )}
    </PageWrapper>
  );
};