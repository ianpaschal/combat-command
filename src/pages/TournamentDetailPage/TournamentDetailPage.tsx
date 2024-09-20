import { useParams } from 'react-router-dom';
import { Separator } from '@radix-ui/react-separator';
import {
  Cog,
  Plus,
  UserRoundPlus,
} from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { CheckInMatchDialog } from '~/components/CheckInMatchDialog';
import { Tournament } from '~/components/CreateTournamentForm/CreateTournamentForm';
import { FloatingActionButton } from '~/components/FloatingActionButton';
import { Card } from '~/components/generic/Card';
import { Drawer } from '~/components/generic/Drawer';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { Stack } from '~/components/generic/Stack';
import { PageWrapper } from '~/components/PageWrapper';
import { createCn } from '~/utils/createCn';

import './TournamentDetailPage.scss';

const cn = createCn('TournamentDetailPage');

export const TournamentDetailPage = (): JSX.Element => {
  const user = useAuth();
  const { id: tournamentId } = useParams();

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
        <Drawer.Root>
          <Drawer.Trigger asChild>
            <FloatingActionButton>
              <Cog />
            </FloatingActionButton>
          </Drawer.Trigger>
          <Drawer.Content side="bottom">
            <Drawer.Header title={`Manage ${tournament.title}`} border side="bottom" />
            <Drawer.Body>
              - MAIN:
              - Button to edit tourney (disabled after starting)
              - Button to publish & open regs
              - Button to close regs
              - Button to Go live! (all the above will lock. switch to battle mode)
              - DANGER ZONE
              - Un-publish:
              - **Warning!** Doing this will hide the tournament and notify all players that the tournament status is pending. If you need to edit tournament details you can do that without un-publishing, and players will be notified of the changes.
              - Cancel (Only for unpublished tournaments)
              - **Warning!** This is permanent! All registrations will be deleted and players will be notified that the tournament was cancelled.
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Root>
      )}
    </PageWrapper>
  );
};