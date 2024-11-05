import { useNavigate } from 'react-router-dom';
import * as Popover from '@radix-ui/react-popover';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import {
  ListFilter,
  Plus,
  Search,
} from 'lucide-react';

import { Button } from '~/components/generic/Button';
import { Card } from '~/components/generic/Card';
import { InputText } from '~/components/generic/InputText';
import { PageWrapper } from '~/components/PageWrapper';
import { TournamentCard } from '~/components/TournamentCard/TournamentCard';
import { useFetchTournamentsList } from '~/services/tournaments/fetchTournamentsList';
import { MIN_WIDTH_TABLET } from '~/settings';
import { bem } from '~/utils/componentLib/bem';

import './TournamentsPage.scss';

const cn = bem('TournamentsPage');

export const TournamentsPage = (): JSX.Element => {
  const navigate = useNavigate();
  const handleClickCreateTournament = (): void => {
    navigate('/tournaments/create');
  };

  const showButtonText = useWindowWidth() > MIN_WIDTH_TABLET;

  const { data: tournaments } = useFetchTournamentsList();

  console.log(tournaments);

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
      {tournaments && (
        <div className={cn('List')}>
          {tournaments.map((tournament) => (
            <Card key={tournament.id} disablePadding>
              <TournamentCard tournament={tournament} />
            </Card>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};