import { useWindowWidth } from '@react-hook/window-size/throttled';
import {
  ListFilter,
  Plus,
  Search,
} from 'lucide-react';
import { Popover } from 'radix-ui';

import { useAuth } from '~/components/AuthProvider';
import { FloatingActionButton } from '~/components/FloatingActionButton';
import { Button } from '~/components/generic/Button';
import { InputText } from '~/components/generic/InputText';
import { MatchResultCard } from '~/components/MatchResultCard';
import { MatchResultCreateDialog, useMatchResultCreateDialog } from '~/components/MatchResultCreateDialog';
import { PageWrapper } from '~/components/PageWrapper';
import { useGetMatchResults } from '~/services/matchResults';
import { DEFAULT_PAGE_SIZE, MIN_WIDTH_TABLET } from '~/settings';

import styles from './MatchResultsPage.module.scss';

export const MatchResultsPage = (): JSX.Element => {
  const user = useAuth();
  const showFilters = false;
  const showAddMatchResultButton = !!user;
  const showButtonText = useWindowWidth() > MIN_WIDTH_TABLET;
  const { open } = useMatchResultCreateDialog();
  const { data: matchResults, loadMore } = useGetMatchResults({});
  const handleLoadMore = (): void => {
    loadMore(DEFAULT_PAGE_SIZE);
  };
  return (
    <PageWrapper title="Match Results">
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
        </div>
      )}
      <div className={styles.List}>
        {(matchResults || []).map((matchResult) => (
          <MatchResultCard key={matchResult._id} matchResult={matchResult} />
        ))}
      </div>
      <div className={styles.List_LoadMoreButton} onClick={handleLoadMore}>
        <Button text="Load More" />
      </div>
      {showAddMatchResultButton && (
        <FloatingActionButton icon={<Plus />} onClick={() => open()} />
      )}
      <MatchResultCreateDialog />
    </PageWrapper>
  );
};
