import { useNavigate } from 'react-router-dom';
import { sentenceCase } from 'change-case';
import { formatDistance } from 'date-fns';
import { ChevronRight, Ellipsis } from 'lucide-react';

import { FetchMatchResultListResponseItem } from '~/api';
import { Button } from '~/components/generic/Button';
import { Separator } from '~/components/generic/Separator';
import { Timestamp } from '~/components/generic/Timestamp';
import { MatchResultPlayers } from '~/components/MatchResultPlayers';
import { MatchResultSocials } from '~/components/MatchResultSocials';
import { MatchResultPhotos } from './MatchResultPhotos';

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
  const detailsPath = `/match-results/${matchResult._id}`;
  const handleClickDetails = (): void => {
    navigate(detailsPath);
  };
  return (
    <div className={styles.MatchResultCard}>
      {usePhotos && <MatchResultPhotos />}
      <MatchResultPlayers matchResult={matchResult} />
      <Separator />
      <MatchResultSocials matchResult={matchResult} className={styles.Socials} />
      <Separator />
      <div className={styles.Footer}>
        <Timestamp date={new Date(matchResult.playedAt)} className={styles.Timestamp} />
        {/* TODO: Add actions */}
        <Button muted>
          <Ellipsis />
        </Button>
        <Button onClick={handleClickDetails}>
          Details
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};
