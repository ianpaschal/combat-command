import clsx from 'clsx';
import { Plus } from 'lucide-react';

import { UserId } from '~/api';
import { Button } from '~/components/generic/Button';
import { Card, CardHeader } from '~/components/generic/Card';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { MatchResultCard } from '~/components/MatchResultCard';
import { useGetMatchResultsByUser } from '~/services/matchResults';
import { DEFAULT_PAGE_SIZE } from '~/settings';

import styles from './UserTournamentsCard.module.scss';

export interface UserTournamentsCardProps {
  className?: string;
  userId: UserId;
}

export const UserTournamentsCard = ({
  className,
  userId,
}: UserTournamentsCardProps): JSX.Element => {

  const { data: matchResults, loadMore: loadMoreMatchResults, status } = useGetMatchResultsByUser({
    userId,
  });
  return (
    <Card className={clsx(styles.UserTournamentsCard, className)}>
      <CardHeader title="Tournaments" />
      <ScrollArea>
        <div className={styles.UserProfilePage_MatchResults_List}>
          {(matchResults ?? []).map((matchResult) => (
            <MatchResultCard key={matchResult._id} matchResult={matchResult} />
          ))}
          {(status === 'CanLoadMore' || status === 'LoadingMore') && (
            <div className={styles.UserProfilePage_MatchResults_List_ViewAllButton}>
              <Button
                disabled={status === 'LoadingMore'}
                icon={<Plus />}
                text="Load More"
                onClick={() => loadMoreMatchResults(DEFAULT_PAGE_SIZE)}
              />
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
