import { generatePath, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import { MatchResult } from '~/api';
import { Button } from '~/components/generic/Button';
import { Separator } from '~/components/generic/Separator';
import { Timestamp } from '~/components/generic/Timestamp';
import { MatchResultContextMenu } from '~/components/MatchResultContextMenu';
import { MatchResultPhotos } from '~/components/MatchResultPhotos';
import { MatchResultPlayers } from '~/components/MatchResultPlayers';
import { MatchResultProvider } from '~/components/MatchResultProvider';
import { MatchResultSocials } from '~/components/MatchResultSocials';
import { PATHS } from '~/settings';

// import { MatchResultPhotos } from './MatchResultPhotos';
import styles from './MatchResultCard.module.scss';

export interface MatchResultCardProps {
  matchResult: MatchResult;
}

export const MatchResultCard = ({
  matchResult,
}: MatchResultCardProps): JSX.Element => {
  const navigate = useNavigate();
  // TODO: Replace with global feature flags
  const usePhotos = true;
  const detailsPath = generatePath(PATHS.matchResultDetails, { id: matchResult._id });
  const handleClickDetails = (): void => {
    navigate(detailsPath);
  };
  return (
    <MatchResultProvider matchResult={matchResult}>
      <div className={styles.MatchResultCard}>
        {usePhotos && (
          <MatchResultPhotos className={styles.MatchResultCard_Photos} />
        )}
        <MatchResultPlayers />
        <Separator />
        <MatchResultSocials className={styles.Socials} />
        <Separator />
        <div className={styles.Footer}>
          <Timestamp date={new Date(matchResult.playedAt)} className={styles.Timestamp} />
          <MatchResultContextMenu />
          <Button onClick={handleClickDetails}>
            Details
            <ChevronRight />
          </Button>
        </div>
      </div>
    </MatchResultProvider>
  );
};
