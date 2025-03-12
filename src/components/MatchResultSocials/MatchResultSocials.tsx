import clsx from 'clsx';
import { MessageCircle } from 'lucide-react';

import { MatchResult } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { Animate } from '~/components/generic/Animate';
import { Button } from '~/components/generic/Button';
import { Dialog, DialogHeader } from '~/components/generic/Dialog';
import { Drawer } from '~/components/generic/Drawer';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { Separator } from '~/components/generic/Separator';
import { HeartToggle } from '~/components/HeartToggle';
import { MatchResultCommentForm } from '~/components/MatchResultCommentForm';
import { MatchResultComments } from '~/components/MatchResultComments';
import { MatchResultLikes } from '~/components/MatchResultLikes';
import { useToggleMatchResultLike } from '~/services/matchResultLikes/useToggleMatchResultLike';

import styles from './MatchResultSocials.module.scss';

export interface MatchResultSocialsProps {
  className?: string;
  matchResult: MatchResult;
}

export const MatchResultSocials = ({
  className,
  matchResult,
}: MatchResultSocialsProps): JSX.Element => {
  const user = useAuth();
  const likeCount = matchResult.likedByUserIds.length;
  const isLiked = !!(user && matchResult.likedByUserIds.includes(user._id));
  const toggleMatchResultLike = useToggleMatchResultLike();
  const handleToggleLike = (): void => {
    toggleMatchResultLike.toggleMatchResultLike({
      matchResultId: matchResult._id,
    });
  };
  return (
    <>
      <div className={clsx(styles.MatchResultSocials, className)} >
        <HeartToggle checked={isLiked} onCheckedChange={handleToggleLike} />
        <Animate show={likeCount > 0}>
          <Dialog
            width="small"
            trigger={
              <Button size="small" variant="ghost" className={styles.LikesButton}>
                {`${likeCount} ${likeCount === 1 ? 'Like' : 'Likes'}`}
              </Button>
            }
          >
            <DialogHeader title="Likes" />
            <Separator />
            <ScrollArea>
              <MatchResultLikes className={styles.LikesList} matchResultId={matchResult._id} />
            </ScrollArea>
          </Dialog>
        </Animate>
        <Drawer
          side="right"
          size="30rem"
          trigger={
            <Button size="small" variant="ghost">
              <MessageCircle />
              {`${matchResult.commentCount} ${matchResult.commentCount === 1 ? 'Comment' : 'Comments'}`}
            </Button>
          }
        >
          <DialogHeader title="Comments" />
          <Separator />
          <ScrollArea className={styles.CommentListScrollArea}>
            <MatchResultComments className={styles.CommentList} matchResultId={matchResult._id} />
          </ScrollArea>
          <Separator />
          {user && (
            <MatchResultCommentForm className={styles.CommentForm} matchResultId={matchResult._id} />
          )}
        </Drawer>
        {/* <Button size="small" variant="ghost" round className={styles.Share}>
          <Share />
        </Button> */}
      </div>
    </>
  );
};
