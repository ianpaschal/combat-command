import clsx from 'clsx';

import { MatchResultId } from '~/api';
import { Avatar } from '~/components/generic/Avatar';
import { useGetMatchResultLikesByMatchResult } from '~/services/matchResultLikes';
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
  const { data: matchResultLikes } = useGetMatchResultLikesByMatchResult({
    matchResultId,
  });
  return (
    <div className={clsx(styles.MatchResultLikes, className)}>
      {(matchResultLikes || []).map((like) => (
        <div className={styles.MatchResultLikes__Like} key={like._id}>
          <Avatar url={like.user.avatarUrl} />
          {getUserDisplayNameString(like.user)}
        </div>
      ))}
    </div>
  );
};
