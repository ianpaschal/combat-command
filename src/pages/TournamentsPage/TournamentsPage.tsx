import { useNavigate } from 'react-router-dom';
import * as Popover from '@radix-ui/react-popover';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import {
  ListFilter,
  Plus,
  Search,
} from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { Card } from '~/components/generic/Card';
import { InputText } from '~/components/generic/InputText';
import { PageWrapper } from '~/components/PageWrapper';
import { TournamentCard } from '~/components/TournamentCard/TournamentCard';
import { MIN_WIDTH_TABLET } from '~/settings';
import { TournamentRecord } from '~/types/Tournament';
import { bem } from '~/utils/componentLib/bem';

import './TournamentsPage.scss';

const cn = bem('TournamentsPage');

export const TournamentsPage = (): JSX.Element => {
  const user = useAuth();
  const navigate = useNavigate();
  const handleClickCreateTournament = (): void => {
    navigate('/tournaments/create');
  };

  const showButtonText = useWindowWidth() > MIN_WIDTH_TABLET;

  // TODO: Maybe just fetch the data. easier to fetch it once rather than for every card
  const tournaments: TournamentRecord[] = [
    {
      id: 'dd616369-917c-4506-a017-ba3a8e503eda',
      created_at: 'foo',
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
    },
    {
      id: '012829f9-ecb3-499d-9303-ee60ce0585c5',
      created_at: 'foo',
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
    },
    {
      id: '85e74706-99d4-4dd9-bfd2-7e2e7e1a213d',
      created_at: 'foo',
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
      organizer_ids: [''],
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
    },
    {
      id: 'c116273b-4599-400c-bab8-f86a01d0793b',
      created_at: 'foo',
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
      organizer_ids: [''],
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
    },
  ];

  return (
    <PageWrapper title="Tournaments">
      <div className={cn('Filters')}>
        <InputText slotBefore={<Search />} placeholder="Search..." />
        <Popover.Root>
          <Popover.Trigger asChild>
            <Button variant="outlined">
              <ListFilter />
              {showButtonText && (
                <span>Filter</span>
              )}
            </Button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content className={cn('FilterPopover')} align="end">
              Coming soon!
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        <Button onClick={handleClickCreateTournament}>
          <Plus />
          {showButtonText && (
            <span>Create</span>
          )}
        </Button>
      </div>
      <div className={cn('List')}>
        {tournaments.map((tournaments) => (
          <Card disablePadding>
            <TournamentCard key={tournaments.id} tournament={tournaments} />
          </Card>
        ))}
      </div>
    </PageWrapper>
  );
};