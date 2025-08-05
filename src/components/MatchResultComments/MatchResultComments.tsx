import { sentenceCase } from 'change-case';
import clsx from 'clsx';
import { formatDistance } from 'date-fns';

import { MatchResultId } from '~/api';
import { Avatar } from '~/components/generic/Avatar';
import { useGetMatchResultCommentsByMatchResult } from '~/services/matchResultComments';

import styles from './MatchResultComments.module.scss';

export interface MatchResultCommentsProps {
  className?: string;
  matchResultId: MatchResultId;
}

export const MatchResultComments = ({
  className,
  matchResultId,
}: MatchResultCommentsProps): JSX.Element => {
  const { data: matchResultComments } = useGetMatchResultCommentsByMatchResult({
    matchResultId,
  });
  return (
    <div className={clsx(styles.MatchResultComments, className)}>
      {(matchResultComments || []).map((comment) => (
        <div key={comment._id} className={styles.Comment}>
          <Avatar url={comment.user.avatarUrl} className={styles.Avatar} />
          <div className={styles.Name}>
            <span>{comment.user.displayName}</span>
            <span className={styles.Timestamp}>{sentenceCase(formatDistance(new Date(comment._creationTime), new Date(), {
              addSuffix: true,
            }))}</span>
          </div>
          <div className={styles.Body}>
            {comment.body}
          </div>
        </div>
      ))}
    </div>
  );
};
