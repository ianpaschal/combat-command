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
import { CheckInMatchDialog } from '~/components/CheckInMatchDialog';
import { FloatingActionButton } from '~/components/FloatingActionButton';
import { Button } from '~/components/generic/Button';
import { InputText } from '~/components/generic/InputText';
import { MatchResultCard } from '~/components/MatchResultCard';
import { PageWrapper } from '~/components/PageWrapper';
import { MIN_WIDTH_TABLET } from '~/settings';

import styles from './MatchResultsPage.module.scss';

export const MatchResultsPage = (): JSX.Element => {
  const user = useAuth();
  const showAddMatchResultButton = !!user;
  const showButtonText = useWindowWidth() > MIN_WIDTH_TABLET;
  const matchResults = useQuery(api.matchResults.fetchMatchResultList.fetchMatchResultList);
  return (
    <PageWrapper title="Match Results">
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
      </div>
      <div className={styles.List}>
        {(matchResults || []).map((matchResult) => (
          <MatchResultCard key={matchResult._id} matchResult={matchResult} />
        ))}
      </div>
      {showAddMatchResultButton && (
        <CheckInMatchDialog>
          <FloatingActionButton>
            <Plus />
          </FloatingActionButton>
        </CheckInMatchDialog>
      )}
    </PageWrapper>
  );
};
