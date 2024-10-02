import { ReactNode, useState } from 'react';

import { Button } from '~/components/generic/Button';
import { Card } from '~/components/generic/Card';
import { Drawer } from '~/components/generic/Drawer';
import { Label } from '~/components/generic/Label';
import { Stack } from '~/components/generic/Stack';
import { Switch } from '~/components/generic/Switch';
import { TournamentRecord } from '~/types/Tournament';

import './ManageTournamentDrawer.scss';

export interface ManageTournamentDrawerProps {
  tournamentId: string;
  trigger: ReactNode;
}

export const ManageTournamentDrawer = ({
  // tournamentId,
  trigger,
}: ManageTournamentDrawerProps): JSX.Element => {

  const tournament: TournamentRecord = {
    id: '27b59ae9-30d5-4e38-a0e0-20f66ed35a06',
    created_at: 'foo',
    status: 'published',
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
    organizer_ids: [''],
    registrations_open: true,
    registrations_close_at: '2024-11-03',
    round_count: 5,
    rules_pack_url: 'https://drive.google.com/file/d/1rtX-xqkbHxgHEe-Ggd1msqclb5HdWJ8C',
    start_date: '2024-11-09',
    start_time: '8:00',
    title: 'FOW Belgian Nationals 2024',
    use_national_teams: false,
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

  const [registrationsOpen, setRegistrationsOpen] = useState<boolean>(tournament.registrations_open);

  const showEditButton = ['draft', 'published'].includes(tournament.status);
  const showPublishButton = tournament.status === 'draft';
  const showCloseRegistrationsButton = tournament.status === 'published';
  const showStartTournamentButton = tournament.status === 'published' && !tournament.registrations_open;

  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        {trigger}
      </Drawer.Trigger>
      <Drawer.Content side="bottom">
        <Drawer.Header title={`Manage ${tournament.title}`} border side="bottom" />
        <Drawer.Body className="ManageTournamentDrawer_Body">
          {showEditButton && (
            <Card>
              <Button variant="outlined">Edit Tournament Details</Button>
            </Card>
          )}
          {showPublishButton && (
            <Card>
              <Button>Publish</Button>
            </Card>
          )}
          {showCloseRegistrationsButton && (
            <Card title="Registrations" description='Set registrations to "Open" to closed. You can also configure a moment in them for them to close automatically.'>
              <Stack orientation="horizontal" verticalAlign="center">
                <Switch id="isTeam" checked={registrationsOpen} onCheckedChange={() => setRegistrationsOpen(!registrationsOpen)} />
                <Label htmlFor="isTeam">Registrations Open</Label>
              </Stack>
            </Card>
          )}
          {showStartTournamentButton && (
            <Card>
              <Button>Start Tournament</Button>
            </Card>
          )}
          <Card title="Danger Zone" intent="danger">
            <p><strong>Warning!</strong> Doing this will hide the tournament and notify all players that the tournament status is pending. If you need to edit tournament details you can do that without un-publishing, and players will be notified of the changes.</p>
            <Button variant="outlined" intent="danger">Un-Publish Tournament</Button>
            <p>**Warning!** This is permanent! All registrations will be deleted and players will be notified that the tournament was cancelled.</p>
            <Button variant="outlined" intent="danger">Cancel Tournament</Button>
          </Card>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
};