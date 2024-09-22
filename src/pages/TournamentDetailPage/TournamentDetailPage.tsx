import { useParams } from 'react-router-dom';
import { Separator } from '@radix-ui/react-separator';
import {
  Cog,
  Plus,
  UserRoundPlus,
} from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { CheckInMatchDialog } from '~/components/CheckInMatchDialog';
import { FloatingActionButton } from '~/components/FloatingActionButton';
import { Card } from '~/components/generic/Card';
import { Drawer } from '~/components/generic/Drawer';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { Stack } from '~/components/generic/Stack';
import { ManageTournamentDrawer } from '~/components/ManageTournamentDrawer';
import { PageWrapper } from '~/components/PageWrapper';
import { Tournament } from '~/types/Tournament';
import { createCn } from '~/utils/componentLib/createCn';

import './TournamentDetailPage.scss';

const cn = createCn('TournamentDetailPage');

export const TournamentDetailPage = (): JSX.Element => {
  const user = useAuth();
  const params = useParams();
  const tournamentId = params.id!; // Must exist or else how did we get to this route?

  console.log(tournamentId);

  const tournament: Tournament = {
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
  };

  const isOrganizer = user && tournament.organizer_ids.includes(user.id);

  const showRegistrations = tournament.status === 'published' && tournament.registrations_open;
  const showResults = tournament.status === 'active';
  const showRegisterButton = tournament.registrations_open && !isOrganizer;
  const showAddMatchResultButton = tournament.status === 'active' && !isOrganizer && tournament.current_round !== undefined;
  const showPairings = tournament.status === 'active' && tournament.current_round !== undefined;
  const showManageButton = isOrganizer;

  console.log(showAddMatchResultButton);

  return (
    <PageWrapper title={tournament.title} showBackButton>
      <div className="TournamentDetailPage__Body">
        <div className="TournamentDetailPage__OverviewWrapper">
          <Card className="TournamentDetailPage__OverviewSection" disablePadding>
            <div className={cn('__Banner')}>
              <div className={cn('__BannerOverlay')} />
            </div>
            <Stack className={cn('__Description')}>
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
        <div className="TournamentDetailPage__SubSectionsWrapper">
          {showRegistrations && (
            <Card className="TournamentDetailPage__RegistrationsSection" title="Registrations">
              Registrations
            </Card>
          )}
          {showPairings && (
            <Card
              className="TournamentDetailPage__PairingsSection"
              title={`Round ${(tournament.current_round || 0) + 1} Pairings`}
              disablePadding
            >
              <ScrollArea className={cn('__PairingsScrollArea')}>
                <div className={cn('__PairingsItemList')}>
                  <Card className={cn('__PairingItem')}>
                    A match up
                  </Card>
                  <Card className={cn('__PairingItem')}>
                    A match up
                  </Card>
                  <Card className={cn('__PairingItem')}>
                    A match up
                  </Card>
                  <Card className={cn('__PairingItem')}>
                    A match up
                  </Card>
                  <Card className={cn('__PairingItem')}>
                    A match up
                  </Card>
                  <Card className={cn('__PairingItem')}>
                    A match up
                  </Card>
                  <Card className={cn('__PairingItem')}>
                    A match up
                  </Card>
                  <Card className={cn('__PairingItem')}>
                    A match up
                  </Card>
                </div>
              </ScrollArea>

            </Card>
          )}
          {showResults && (
            <>
              <Card className="TournamentDetailPage__RankingsSection" title="Rankings">
                Rankings
              </Card>
              <Card className="TournamentDetailPage__MatchResultsSection" title="Match Results">
                Matches
              </Card>
            </>
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