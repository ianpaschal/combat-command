import { useNavigate } from 'react-router-dom';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import {
  ListFilter,
  Plus,
  Search,
} from 'lucide-react';
import { Popover } from 'radix-ui';

import { Tournament } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { FloatingActionButton } from '~/components/FloatingActionButton';
import { Button } from '~/components/generic/Button';
import { InputText } from '~/components/generic/InputText';
import { PageWrapper } from '~/components/PageWrapper';
import { TournamentCard } from '~/components/TournamentCard/TournamentCard';
import { useGetTournaments } from '~/services/tournaments';
import { MIN_WIDTH_TABLET, PATHS } from '~/settings';

import styles from './TournamentsPage.module.scss';

export const TournamentsPage = (): JSX.Element => {
  const user = useAuth();
  const showFilters = false;
  const showCreateTournamentButton = !!user;
  const navigate = useNavigate();
  const showButtonText = useWindowWidth() > MIN_WIDTH_TABLET;
  const { data: tournaments } = useGetTournaments({});
  const handleClickCreateTournament = (): void => {
    navigate(PATHS.tournamentCreate);
  };

  type StatusGroup = Exclude<Tournament['status'], 'draft'>;
  const { active, archived, published } = (tournaments ?? []).reduce((acc, t) => {
    if (t.status === 'draft') {
      acc.published.push(t);
    } else {
      acc[t.status as StatusGroup].push(t);
    }
    return acc;
  }, {
    active: [],
    archived: [],
    published: [],
  } as Record<StatusGroup, Tournament[]>);

  return (
    <PageWrapper title="Tournaments">
      {showFilters && (
        <div className={styles.Filters}>
          <InputText slotBefore={<Search />} placeholder="Search..." />
          <Popover.Root>
            <Popover.Trigger asChild>
              <Button
                icon={<ListFilter />}
                text={showButtonText ? 'Filter' : undefined}
                variant="outlined"
              />
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content className={styles.FilterPopover} align="end">
                Coming soon!
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
          <Button
            icon={<Plus />}
            text={showButtonText ? 'Create' : undefined}
            onClick={handleClickCreateTournament}
          />
        </div>
      )}
      <div className={styles.TournamentsPage_Content}>
        {active.length > 0 && (
          <div className={styles.TournamentsPage_Section}>
            <h2>On-Going</h2>
            {active.map((tournament) => (
              <TournamentCard key={tournament._id} tournament={tournament} />
            ))}
          </div>
        )}
        {published.length > 0 && (
          <div className={styles.TournamentsPage_Section}>
            <h2>Upcoming</h2>
            {published.map((tournament) => (
              <TournamentCard key={tournament._id} tournament={tournament} />
            ))}
          </div>
        )}
        {archived.length > 0 && (
          <div className={styles.TournamentsPage_Section}>
            <h2>Past</h2>
            {archived.reverse().map((tournament) => (
              <TournamentCard key={tournament._id} tournament={tournament} />
            ))}
          </div>
        )}
      </div>
      {showCreateTournamentButton && (
        <FloatingActionButton icon={<Plus />} onClick={handleClickCreateTournament} />
      )}
    </PageWrapper>
  );
};
