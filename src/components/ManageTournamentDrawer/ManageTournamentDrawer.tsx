import { ReactNode, useState } from 'react';

import { Button } from '~/components/generic/Button';
import { Card } from '~/components/generic/Card';
import { Drawer } from '~/components/generic/Drawer';
import { Label } from '~/components/generic/Label';
import { Stack } from '~/components/generic/Stack';
import { Switch } from '~/components/generic/Switch';
import { Tournament } from '~/types/Tournament';

import './ManageTournamentDrawer.scss';

export interface ManageTournamentDrawerProps {
  trigger: ReactNode;
  tournamentId: string;
}

export const ManageTournamentDrawer = ({
  trigger,
  tournamentId,
}: ManageTournamentDrawerProps): JSX.Element => {

  const tournament: Tournament = {
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
    round_count: 5,
    rules_pack_url: 'https://drive.google.com/file/d/1rtX-xqkbHxgHEe-Ggd1msqclb5HdWJ8C',
    start_date: '2024-11-09',
    start_time: '8:00',
    title: 'FOW Belgian Nationals 2024',
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
        <Drawer.Body className="ManageTournamentDrawer__Body">
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
            <Button variant="outlined" intent="danger">Un-Publish Tournament</Button>
          </Card>

          - DANGER ZONE
          - Un-publish:
          - **Warning!** Doing this will hide the tournament and notify all players that the tournament status is pending. If you need to edit tournament details you can do that without un-publishing, and players will be notified of the changes.
          - Cancel
          - **Warning!** This is permanent! All registrations will be deleted and players will be notified that the tournament was cancelled.

        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
};