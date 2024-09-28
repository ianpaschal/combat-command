import { useParams } from 'react-router-dom';
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
import { ScrollArea } from '~/components/generic/ScrollArea';
import { Stack } from '~/components/generic/Stack';
import { ManageTournamentDrawer } from '~/components/ManageTournamentDrawer';
import { MatchResultCard } from '~/components/MatchResultCard/MatchResultCard';
import { PageWrapper } from '~/components/PageWrapper';
import { PairingCard } from '~/components/PairingCard';
import { TournamentRegistrationsCard } from '~/components/TournamentRegistrationsCard';
import { Tournament } from '~/types/Tournament';
import { bem } from '~/utils/componentLib/bem';

import './TournamentDetailPage.scss';

const cn = bem('TournamentDetailPage');

export const TournamentDetailPage = (): JSX.Element => {
  const user = useAuth();
  const params = useParams();
  const tournamentId = params.id!; // Must exist or else how did we get to this route?

  const tournament: Tournament & { id: string } = {
    id: 'dd616369-917c-4506-a017-ba3a8e503eda',
    status: 'active',
    competitor_count: 40,
    competitor_groups: [{ name: 'All Players', size: 40 }],
    competitor_size: 1,
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
  };

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
    <PageWrapper title={tournament.title} showBackButton>
      <div className={cn('Body')}>
        <div className={cn('OverviewWrapper')}>
          <Card className={cn('OverviewSection')} disablePadding>
            <div className={cn('Banner')}>
              <div className={cn('BannerOverlay')} />
            </div>
            <Stack className={cn('Description')}>
              <div>
                Date
                Place
                Game System & Rules
              </div>
              <h3>Description</h3>
              <p>{tournament.description}</p>
            </Stack>
          </Card>
        </div>
        <div className={cn('SubSectionsWrapper')}>
          {showRegistrations && (
            <TournamentRegistrationsCard className={cn('RegistrationsSection')} tournamentId={tournament.id} />
          )}
          {showRankings && (
            <Card className={cn('RankingsSection')} title="Rankings">
              <FowV4RankingsTable />
            </Card>
          )}
          {showPairings && (
            <Card
              className={cn('PairingsSection')}
              title={`Round ${(tournament.current_round || 0) + 1} Pairings`}
              disablePadding
            >
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
            <Card className={cn('MatchResultsSection')} title="Match Results" disablePadding>
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