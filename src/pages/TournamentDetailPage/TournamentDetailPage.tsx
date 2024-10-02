import { useParams } from 'react-router-dom';
import { Label } from '@radix-ui/react-label';
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
import { ScrollArea } from '~/components/generic/ScrollArea';
import { ManageTournamentDrawer } from '~/components/ManageTournamentDrawer';
import { MatchResultCard } from '~/components/MatchResultCard';
import { PageWrapper } from '~/components/PageWrapper';
import { PairingCard } from '~/components/PairingCard';
import { TournamentCard } from '~/components/TournamentCard/TournamentCard';
import { TournamentRegistrationsCard } from '~/components/TournamentRegistrationsCard';
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
  const fitToWindow = useWindowWidth() >= MIN_WIDTH_DESKTOP;

  const isOrganizer = user && tournament.organizer_ids.includes(user.id);

  // Show registrations and register button:
  const showRegistrations = tournament.status === 'published';

  // Show rankings, pairings, and match results:
  const showRankings = tournament.status === 'active';
  const showMatchResults = tournament.status === 'active';
  const showPairings = tournament.status === 'active' && tournament.current_round !== undefined;

  // Fast-action buttons:
  const showRegisterButton = tournament.registrations_open && !isOrganizer;
  const showAddMatchResultButton = tournament.status === 'active' && !isOrganizer && tournament.current_round !== undefined;
  const showManageButton = isOrganizer;

  return (
    <PageWrapper title={'Test'} showBackButton fitToWindow={fitToWindow}>
      <div className="TournamentDetailPage">
        <TournamentCard className={cn('OverviewCard')} tournament={tournament} expanded />
        {showRankings && (
          <Card className={cn('RankingsCard')} title="Rankings">
            <FowV4RankingsTable />
          </Card>
        )}
        {showRegistrations && (
          <TournamentRegistrationsCard tournamentId={tournament.id} />
        )}
        {showPairings && (
          <Card className={cn('PairingListCard')} title="Pairings" disablePadding>
            <div className={cn('PairingsFilter')}>
              <Label>Round</Label>
              <InputSelect options={[{ value: 'all', label: 'All' }, { value: 'current', label: 'Current' }, '-', { value: 'round_0', label: 'Round 1' }]} />
            </div>
            <ScrollArea className={cn('PairingsScrollArea')} addIndicatorBorder>
              <div className={cn('PairingsItemList')}>
                <PairingCard id="foo" />
                <PairingCard id="foo" />
                <PairingCard id="foo" />
                <PairingCard id="foo" />
                <PairingCard id="foo" />
                <PairingCard id="foo" />
                <PairingCard id="foo" />
                <PairingCard id="foo" />
                <PairingCard id="foo" />
                <PairingCard id="foo" />
              </div>
            </ScrollArea>
          </Card>
        )}
        {showMatchResults && (
          <Card className={cn('MatchResultListCard')} title="Match Results" disablePadding>
            <ScrollArea className={cn('MatchResultsScrollArea')} addIndicatorBorder>
              <div className={cn('MatchResultsItemList')}>
                <MatchResultCard />
                <MatchResultCard />
                <MatchResultCard />
                <MatchResultCard />
                <MatchResultCard />
                <MatchResultCard />
                <MatchResultCard />
                <MatchResultCard />
                <MatchResultCard />
                <MatchResultCard />
                <MatchResultCard />
                <MatchResultCard />
                <MatchResultCard />
              </div>
            </ScrollArea>
          </Card>
        )}
      </div>
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
        <ManageTournamentDrawer
          tournamentId={tournamentId}
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