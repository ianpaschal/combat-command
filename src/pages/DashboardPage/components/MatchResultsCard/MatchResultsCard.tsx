import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { ChevronRight, Plus } from 'lucide-react';

import { Button } from '~/components/generic/Button';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { Separator } from '~/components/generic/Separator';
import { Spinner } from '~/components/generic/Spinner';
import { MatchResultCard } from '~/components/MatchResultCard';
import { MatchResultCreateDialog, useMatchResultCreateDialog } from '~/components/MatchResultCreateDialog';
import { useGetMatchResults } from '~/services/matchResults';
import { PATHS } from '~/settings';

import styles from './MatchResultsCard.module.scss';

export interface MatchResultsCardProps {
  className?: string;
}

export const MatchResultsCard = ({
  className,
}: MatchResultsCardProps): JSX.Element => {
  const navigate = useNavigate();
  const { data: matchResults, loading } = useGetMatchResults({});
  const { open } = useMatchResultCreateDialog();

  const handleViewMore = (): void => {
    navigate(PATHS.matchResults);
  };

  const handleCreate = (): void => {
    open();
  };

  return (
    <>
      <div className={clsx(styles.MatchResultsCard, className)}>
        {loading ? (
          <div className={styles.MatchResultsCard_Loading}>
            <Spinner /> Loading...
          </div>
        ) : (
          <>
            <div className={styles.MatchResultsCard_Header}>
              <h2>
                Recent Matches
              </h2>
              <div className={styles.MatchResultsCard_Header_Actions}>
                <Button icon={<ChevronRight />} variant="secondary" onClick={handleViewMore} />
              </div>
            </div>
            <Separator />
            {(matchResults ?? []).length ? (
              <ScrollArea className={styles.MatchResultsCard_ScrollArea}>
                <div className={styles.MatchResultsCard_List}>
                  {(matchResults ?? []).map((matchResult) => (
                    <MatchResultCard key={matchResult._id} matchResult={matchResult} />
                  ))}
                  <div className={styles.MatchResultsCard_List_ViewAllButton} onClick={handleViewMore}>
                    <Button icon={<ChevronRight />} iconPosition="end" text="View All" />
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className={styles.MatchResultsCard_EmptyState}>
                <Button icon={<Plus />} text="Check-In" onClick={handleCreate} />
              </div>
            )}
          </>
        )}
      </div>
      <MatchResultCreateDialog />
    </>
  );
};
