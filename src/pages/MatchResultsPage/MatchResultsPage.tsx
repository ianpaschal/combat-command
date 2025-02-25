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
import { Card } from '~/components/generic/Card';
import { InputText } from '~/components/generic/InputText';
import { PageWrapper } from '~/components/PageWrapper';
import { useFetchMatchResultList } from '~/services/matchResults/fetchMatchResult';
import { useFetchPlayer } from '~/services/players';
// import { useFetchMatchResultExp, useFetchMatchResultExpList } from '~/services/matchResults/useFetchMatchResultExp';
import { useFetchPlayerList } from '~/services/players/hooks';
import { MIN_WIDTH_TABLET } from '~/settings';

import styles from './MatchResultsPage.module.scss';

export const MatchResultsPage = (): JSX.Element => {
  const { user, profileId } = useAuth();
  const showAddMatchResultButton = !!user;
  const showButtonText = useWindowWidth() > MIN_WIDTH_TABLET;

  // const { data: matchResults } = useFetchMatchResultList({
  //   userProfileId: profileId ? profileId : undefined,
  // });

  // const { data: match } = useFetchMatchResultExp('15584a68-c43a-42f0-9823-7f92c33f5b66');
  // const { data: match } = useFetchMatchResultExp(1);
  // const { data: match } = useFetchMatchResultExpList();
  // console.log(match);

  // const { data: playerSingle } = useFetchPlayer('007639b8-2da0-44fb-a7d4-6b0a27668601');
  // console.log('playerSingle', playerSingle);
  const { data: playerSingle } = useFetchPlayer('007639b8-2da0-44fb-a7d4-6b0a27668601');
  console.log('playerSingle', playerSingle);

  const { data: playerList } = useFetchPlayerList({
    tournamentId: 'f3a0c527-481d-45ed-a253-ec04ec04af01',
  });
  console.log('playerList', playerList);

  const { data: matchResults } = useFetchMatchResultList({
    userProfileId: profileId ?? undefined,
  });
  // console.log('NEW', matchResults);

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
      {/* {matchResults && (
        <div className={styles.List}>
          {matchResults.map((matchResult) => (
            <Card key={matchResult.id}>
              <pre>
                {JSON.stringify(matchResult, null, 2)}
              </pre>
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
