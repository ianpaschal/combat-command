import { useNavigate } from 'react-router-dom';
import * as Popover from '@radix-ui/react-popover';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import { useQuery } from 'convex/react';
import {
  ListFilter,
  Plus,
  Search,
} from 'lucide-react';

import { api } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { FloatingActionButton } from '~/components/FloatingActionButton';
import { Button } from '~/components/generic/Button';
import { InputText } from '~/components/generic/InputText';
import { PageWrapper } from '~/components/PageWrapper';
import { TournamentCard } from '~/components/TournamentCard/TournamentCard';
import { MIN_WIDTH_TABLET, PATHS } from '~/settings';

import styles from './TournamentsPage.module.scss';

export const TournamentsPage = (): JSX.Element => {
  const user = useAuth();
  const showFilters = false;
  const showCreateTournamentButton = !!user;
  const navigate = useNavigate();
  const showButtonText = useWindowWidth() > MIN_WIDTH_TABLET;
  const tournaments = useQuery(api.tournaments.getTournaments);
  const handleClickCreateTournament = (): void => {
    navigate(PATHS.tournamentCreate);
  };
  return (
    <PageWrapper title="Tournaments">
      {showFilters && (
        <div className={styles.Filters}>
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
              <Popover.Content className={styles.FilterPopover} align="end">
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
      )}
      <div className={styles.List}>
        {(tournaments || []).map((tournament) => (
          <TournamentCard key={tournament._id} tournament={tournament} />
        ))}
      </div>
      {showCreateTournamentButton && (
        <FloatingActionButton onClick={handleClickCreateTournament}>
          <Plus />
        </FloatingActionButton>
      )}
    </PageWrapper>
  );
};
