import {
  Heart,
  MessageCircle,
  Share,
} from 'lucide-react';

import { Button } from '~/components/generic/Button';
import { HeartToggle } from '~/components/HeartToggle';

import styles from './MatchResultSocialOverview.module.scss';

export const MatchResultSocialsOverview = (): JSX.Element => {
  console.log('foo');

  const likeCount = 0;

  return (
    <div className={styles.Root}>
      <div className={styles.Likes}>
        {likeCount > 0 ? (
          <>
            <HeartToggle />
            <Button size="small" variant="ghost" style={{ marginLeft: '-1rem' }}>
              3 Likes
            </Button>
          </>
        ) : (
          <Button size="small" variant="ghost">
            <Heart />
            Like
          </Button>
        )}

      </div>
      <div className={styles.Comments}>
        <Button size="small" variant="ghost">
          <MessageCircle />
          2 Comments
        </Button>
      </div>
      <div className={styles.SocialActions}>
        <Button size="small" variant="ghost" round>
          <Share />
        </Button>
      </div>
    </div>
  );
};
