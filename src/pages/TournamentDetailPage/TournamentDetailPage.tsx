import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import {
  ArrowRight,
  Cog,
  Plus,
  UserRoundPlus,
} from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { CheckInMatchDialog } from '~/components/CheckInMatchDialog';
import { FloatingActionButton } from '~/components/FloatingActionButton';
import { FowV4RankingsTable } from '~/components/FowV4RankingsTable/FowV4RankingsTable';
import { Button } from '~/components/generic/Button';
import { Card } from '~/components/generic/Card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/generic/Tabs';
import { ManageTournamentMenu } from '~/components/ManageTournamentMenu';
import { MatchResultCard } from '~/components/MatchResultCard';
import { PageWrapper } from '~/components/PageWrapper';
import { TournamentCard } from '~/components/TournamentCard/TournamentCard';
import { TournamentRegistrationsTable } from '~/components/TournamentRegistrationsTable';
import { TournamentMatchResultsSection } from '~/pages/TournamentDetailPage/TournamentMatchResultsSection';
import { TournamentPairingsSection } from '~/pages/TournamentDetailPage/TournamentPairingsSection';
import { TournamentRoundTimer } from '~/pages/TournamentDetailPage/TournamentRoundTimer';
import { useFetchMatchResultList } from '~/services/matchResults/hooks/useFetchMatchResultList';
import { useFetchTournamentPairingList } from '~/services/tournamentPairings/fetchTournamentPairing';
import { useFetchTournamentFull } from '~/services/tournaments/fetchTournamentFull';
import { MIN_WIDTH_DESKTOP } from '~/settings';
import { FowV4RankingFactor } from '~/types/fowV4/fowV4RankingFactorSchema';
import { calculateTournamentRankings } from '~/utils/common/calculateTournamentRankings';
import { bem } from '~/utils/componentLib/bem';
import flamesOfWarV4Utils from '~/utils/flamesOfWarV4Utils';

import './TournamentDetailPage.scss';

const cn = bem('TournamentDetailPage');

export const TournamentDetailPage = (): JSX.Element => {
  const { user, profileId } = useAuth();
  const params = useParams();
  const tournamentId = params.id!; // Must exist or else how did we get to this route?

  const { data: tournament } = useFetchTournamentFull(tournamentId);
  const { data: matches } = useFetchMatchResultList({ tournamentId });

  console.log(tournament);

  const [tab, setTab] = useState<string>('rankings');

  const isDesktop = useWindowWidth() >= MIN_WIDTH_DESKTOP;

  const isOrganizer = user && tournament?.creator_id === profileId;

  const isTournamentActive = tournament?.status === 'active';
  const isRoundActive = isTournamentActive && tournament.current_round !== undefined && tournament.current_round !== null; // TODO: PIck null or undefined

  const isOverviewCardVisible = !isRoundActive && isDesktop;

  useEffect(() => {
    // If you are in the overview tab and overview would become visible by default, switch tabs
    if (tab === 'overview' && isOverviewCardVisible) {
      setTab('rankings');
    }
  }, [tab, isOverviewCardVisible]);

  // Fast-action buttons:
  const showRegisterButton = tournament?.registrations_open && !isOrganizer;
  const showAddMatchResultButton = tournament?.status === 'active' && !isOrganizer && tournament?.current_round !== undefined;
  const showManageButton = isOrganizer && tournament;

  const rankedResults = tournament && tournament.current_round !== null ? calculateTournamentRankings<FowV4RankingFactor>(
    tournament,
    matches || [],
    flamesOfWarV4Utils.aggregateCompetitorResults,
  ) : [];

  return (
    <PageWrapper title={tournament?.title} showBackButton fitToWindow>
      {tournament && (
        <Tabs className={'TournamentDetailPage'} value={tab} onValueChange={setTab}>
          {(isRoundActive || isOverviewCardVisible) && (
            <div className={cn('SecondarySection')}>
              {isRoundActive && tournament.current_round !== null && (
                <>
                  <TournamentRoundTimer
                    className={cn('RoundTimerSection')}
                    tournamentId={tournament.id}
                    roundIndex={tournament.current_round}
                  />
                  {isDesktop && (
                    <div className={cn('LiveMatchResults')}>
                      <h2>Match Results</h2>
                      <div className="LiveMatchResultItemList">
                        {[...(matches || [])].reverse().map((match) => (
                          <MatchResultCard key={match.id} matchData={match} />
                        ))}
                      </div>
                      <Button
                        className={cn('LiveMatchResultsViewMoreButton')}
                        variant="outlined"
                        onClick={() => setTab('matches')}
                      >
                        View All Results<ArrowRight />
                      </Button>
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
                <FowV4RankingsTable results={rankedResults} />
              </Card>
            </TabsContent>
            <TabsContent value="pairings" className={cn('TabsContentSection')}>
              <TournamentPairingsSection tournamentId={tournamentId} />
            </TabsContent>
            <TabsContent value="matches" className={cn('TabsContentSection')}>
              <TournamentMatchResultsSection tournamentId={tournament.id} />
            </TabsContent>
          </div>
        </Tabs>
      )}
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
