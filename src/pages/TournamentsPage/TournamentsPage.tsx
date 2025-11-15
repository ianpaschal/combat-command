import { useNavigate } from 'react-router-dom';
import { Badge } from '@ianpaschal/combat-command-components';
import { getGameSystemOptions, SelectOption } from '@ianpaschal/combat-command-game-systems/common';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import {
  ListFilter,
  Plus,
  Search,
} from 'lucide-react';
import {
  parseAsArrayOf,
  parseAsString,
  useQueryState,
} from 'nuqs';
import { useDebounce } from 'use-debounce';

import { TournamentStatus } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { FloatingActionButton } from '~/components/FloatingActionButton';
import { Button } from '~/components/generic/Button';
import { Checkbox } from '~/components/generic/Checkbox';
import { DialogHeader } from '~/components/generic/Dialog';
import { Drawer } from '~/components/generic/Drawer';
import { InputMultiCheckbox } from '~/components/generic/InputMultiCheckbox';
import { InputText } from '~/components/generic/InputText';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { Separator } from '~/components/generic/Separator';
import { PageWrapper } from '~/components/PageWrapper';
import { TournamentCard } from '~/components/TournamentCard/TournamentCard';
import { usePageTitle } from '~/pages/TournamentsPage/TournamentsPage.hooks';
import { useGetTournaments } from '~/services/tournaments';
import { MIN_WIDTH_TABLET, PATHS } from '~/settings';

import styles from './TournamentsPage.module.scss';

const STATUS_OPTIONS: SelectOption<TournamentStatus>[] = [
  { label: 'Draft', value: 'draft' },
  { label: 'Upcoming', value: 'published' },
  { label: 'Ongoing', value: 'active' },
  { label: 'Past', value: 'archived' },
];

export const TournamentsPage = (): JSX.Element => {
  const user = useAuth();
  const showCreateTournamentButton = !!user;
  const navigate = useNavigate();
  const showButtonText = useWindowWidth() > MIN_WIDTH_TABLET;

  // Filters:
  const [gameSystem, setGameSystem] = useQueryState('gameSystem', parseAsArrayOf(parseAsString));
  const [order] = useQueryState('order');
  const [status, setStatus] = useQueryState('status', parseAsArrayOf(parseAsString));
  const [userId, setUserId] = useQueryState('userId');
  const [search, setSearch] = useQueryState('search');
  const [debouncedSearch] = useDebounce(search, 500);

  const title = usePageTitle(user, { status, userId });

  const { data: tournaments } = useGetTournaments({
    search: debouncedSearch,
    order,
    userId,
    status,
    gameSystem,
  });

  const activeFilterCount = [userId, status, gameSystem].filter((filter) => !!filter).length;

  const handleClickCreateTournament = (): void => {
    navigate(PATHS.tournamentCreate);
  };

  return (
    <PageWrapper title={title}>
      <div className={styles.TournamentsPage_FilterBar}>
        <InputText
          slotBefore={<Search />}
          placeholder="Search..."
          value={search ?? ''}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Drawer
          side="right"
          size="24rem"
          trigger={
            <Badge value={activeFilterCount}>
              <Button
                icon={<ListFilter />}
                text={showButtonText ? 'Filter' : undefined}
                variant="outlined"
              />
            </Badge>
          }
        >
          <DialogHeader title="Filter Tournaments" />
          <Separator />
          <ScrollArea>
            <div className={styles.TournamentsPage_Filters}>
              {user && (
                <div className={styles.TournamentsPage_Filters_Filter}>
                  <h2>My Tournaments</h2>
                  <Checkbox
                    onChange={(checked) => setUserId(checked ? user._id : null)}
                    value={!!userId}
                  />
                </div>
              )}
              <div className={styles.TournamentsPage_Filters_Filter}>
                <h2>Status</h2>
                <InputMultiCheckbox
                  onChange={(value) => setStatus(value.length ? value : null)}
                  options={STATUS_OPTIONS}
                  value={status ?? []}
                />
              </div>
              <div className={styles.TournamentsPage_Filters_Filter}>
                <h2>Game System</h2>
                <InputMultiCheckbox
                  onChange={(value) => setGameSystem(value.length ? value : null)}
                  options={getGameSystemOptions()}
                  value={gameSystem ?? []}
                />
              </div>
            </div>
          </ScrollArea>
        </Drawer>
        <Button
          icon={<Plus />}
          text={showButtonText ? 'Create' : undefined}
          onClick={handleClickCreateTournament}
        />
      </div>
      <div className={styles.TournamentsPage_Content}>
        {(tournaments ?? []).map((tournament) => (
          <TournamentCard key={tournament._id} tournament={tournament} />
        ))}
      </div>
      {showCreateTournamentButton && (
        <FloatingActionButton icon={<Plus />} onClick={handleClickCreateTournament} />
      )}
    </PageWrapper>
  );
};
