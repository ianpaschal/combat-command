import * as Popover from '@radix-ui/react-popover';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import {
  ListFilter,
  Plus,
  Search,
} from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { CheckInMatchDialog } from '~/components/CheckInMatchDialog';
import { FloatingActionButton } from '~/components/FloatingActionButton';
import { Button } from '~/components/generic/Button';
import { InputText } from '~/components/generic/InputText';
import { PageWrapper } from '~/components/PageWrapper';
import { MIN_WIDTH_TABLET } from '~/settings';

import styles from './MatchResultsPage.module.scss';

export const MatchResultsPage = (): JSX.Element => {
  const { user } = useAuth();
  const showAddMatchResultButton = !!user;
  const showButtonText = useWindowWidth() > MIN_WIDTH_TABLET;

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
      {/* {tournaments && (
        <div className={styles.List}>
          {tournaments.map((tournament) => (
            <Card key={tournament.id} disablePadding>
              <TournamentCard tournament={tournament} />
            </Card>
          ))}
        </div>
      )} */}
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