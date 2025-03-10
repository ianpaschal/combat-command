import { useNavigate } from 'react-router-dom';
import { sentenceCase } from 'change-case';
import { formatDistance } from 'date-fns';
import { ChevronRight, Ellipsis } from 'lucide-react';

import { FetchMatchResultListResponseItem } from '~/api';
import { Button } from '~/components/generic/Button';
import { Separator } from '~/components/generic/Separator';
import { MatchResultPhotos } from './MatchResultPhotos';
import { MatchResultSocialsOverview } from './MatchResultSocialOverview';
import { PlayersBlock } from './PlayersBlock';

import styles from './MatchResultCard.module.scss';

export interface MatchResultCardProps {
  matchResult: FetchMatchResultListResponseItem;
}

export const MatchResultCard = ({
  matchResult,
}: MatchResultCardProps): JSX.Element => {
  const navigate = useNavigate();

  // TODO: Replace with global feature flags
  const usePhotos = false;
  const useSocials = true;

  const detailsPath = `/match-results/${matchResult._id}`;

  const handleClickDetails = (): void => {
    navigate(detailsPath);
  };

  // const handleClickLike = (): void => {
  //   // Create a new like
  // };

  // const handleClickLikes = (): void => {
  //   navigate(`${detailsPath}?focus="likes"`);
  // };

  // const handleClickComments = (): void => {
  //   navigate(`${detailsPath}?focus="comments"`);
  // };

  return (
    <div className={styles.Root}>
      {usePhotos && <MatchResultPhotos />}
      <PlayersBlock matchResult={matchResult} />
      <Separator />
      {useSocials && <MatchResultSocialsOverview />}
      <Separator />
      <div className={styles.Footer}>
        <span className={styles.Date}>
          {sentenceCase(formatDistance(new Date(matchResult.playedAt), new Date(), {
            addSuffix: true,
          }))}
        </span>
        {/* TODO: Add actions */}
        <Button size="small" muted>
          <Ellipsis />
        </Button>
        <Button size="small" onClick={handleClickDetails}>
          Details
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};
