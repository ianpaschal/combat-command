import clsx from 'clsx';
import { Plus } from 'lucide-react';

import { UserId } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { Card, CardHeader } from '~/components/generic/Card';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { MatchResultCard } from '~/components/MatchResultCard';
import { MatchResultCreateDialog, useMatchResultCreateDialog } from '~/components/MatchResultCreateDialog';
import { useGetMatchResultsByUser } from '~/services/matchResults';
import { DEFAULT_PAGE_SIZE } from '~/settings';

import styles from './UserMatchResultsCard.module.scss';

export interface UserMatchResultsCardProps {
  className?: string;
  userId: UserId;
}

export const UserMatchResultsCard = ({
  className,
  userId,
}: UserMatchResultsCardProps): JSX.Element => {
  const user = useAuth();
  const { open } = useMatchResultCreateDialog();
  const { data: matchResults, loadMore: loadMoreMatchResults, status } = useGetMatchResultsByUser({
    userId,
  });
  return (
    <Card className={clsx(styles.UserMatchResultsCard, className)}>
      <CardHeader title="Match Results">
        {user?._id === userId && (
          <Button onClick={() => open()}>
            <Plus />Check-In
          </Button>
        )}
      </CardHeader>
      <ScrollArea>
        <div className={styles.UserMatchResultsCard_List}>
          {(matchResults ?? []).map((matchResult) => (
            <MatchResultCard key={matchResult._id} matchResult={matchResult} />
          ))}
          {(status === 'CanLoadMore' || status === 'LoadingMore') && (
            <div className={styles.UserMatchResultsCard_List_ViewAllButton}>
              <Button
                onClick={() => loadMoreMatchResults(DEFAULT_PAGE_SIZE)}
                disabled={status === 'LoadingMore'}
              >
                <Plus />
                Load More
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
      <MatchResultCreateDialog />
    </Card>
  );
};
