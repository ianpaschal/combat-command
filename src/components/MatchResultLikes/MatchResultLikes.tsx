import clsx from 'clsx';
import { useQuery } from 'convex/react';

import { api, MatchResultId } from '~/api';
import { Avatar } from '~/components/generic/Avatar';
import { getUserDisplayNameString } from '~/utils/common/getUserDisplayNameString';

import styles from './MatchResultLikes.module.scss';

interface MatchResultLikesProps {
  className?: string;
  matchResultId: MatchResultId
}

export const MatchResultLikes = ({
  className,
  matchResultId,
}: MatchResultLikesProps): JSX.Element => {
  const likes = useQuery(api.matchResultLikes.queries.getMatchResultLikesByMatchResultId, {
    matchResultId,
  });
  return (
    <div className={clsx(styles.MatchResultLikes, className)}>
      {(likes || []).map((like) => (
        <div className={styles.MatchResultLikes__Like} key={like._id}>
          <Avatar url={like.user.avatarUrl} />
          {getUserDisplayNameString(like.user)}
        </div>
      ))}
    </div>
  );
};
