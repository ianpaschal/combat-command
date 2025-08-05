import clsx from 'clsx';

import { MatchResultId } from '~/api';
import { Avatar } from '~/components/generic/Avatar';
import { useGetMatchResultLikesByMatchResult } from '~/services/matchResultLikes';

import styles from './MatchResultLikes.module.scss';

interface MatchResultLikesProps {
  className?: string;
  matchResultId: MatchResultId
}

export const MatchResultLikes = ({
  className,
  matchResultId,
}: MatchResultLikesProps): JSX.Element => {
  const { data: matchResultLikes } = useGetMatchResultLikesByMatchResult({
    matchResultId,
  });
  return (
    <div className={clsx(styles.MatchResultLikes, className)}>
      {(matchResultLikes || []).map((like) => (
        <div className={styles.MatchResultLikes__Like} key={like._id}>
          {/* TODO: Replace with identity badge */}
          <Avatar url={like.user.avatarUrl} />
          {like.user.displayName}
        </div>
      ))}
    </div>
  );
};
