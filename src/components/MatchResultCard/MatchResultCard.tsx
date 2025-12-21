import { generatePath, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import { MatchResult } from '~/api';
import { Button } from '~/components/generic/Button';
import { Separator } from '~/components/generic/Separator';
import { Spinner } from '~/components/generic/Spinner';
import { Timestamp } from '~/components/generic/Timestamp';
import { MatchResultContextMenu } from '~/components/MatchResultContextMenu';
import { MatchResultPlayers } from '~/components/MatchResultPlayers';
import { MatchResultProvider } from '~/components/MatchResultProvider';
import { MatchResultSocials } from '~/components/MatchResultSocials';
import { PATHS } from '~/settings';
import { MatchResultPhotos } from './MatchResultPhotos';

import styles from './MatchResultCard.module.scss';

export interface MatchResultCardProps {
  matchResult?: MatchResult;
}

export const MatchResultCard = ({
  matchResult,
}: MatchResultCardProps): JSX.Element => {
  const navigate = useNavigate();
  // TODO: Replace with global feature flags
  const usePhotos = false;
  const handleClickDetails = (): void => {
    if (!matchResult) {
      return; // TODO: Error
    }
    navigate(generatePath(PATHS.matchResultDetails, { id: matchResult._id }));
  };
  // TODO: Skeleton loading
  return (
    <div className={styles.MatchResultCard}>
      {matchResult ? (
        <MatchResultProvider matchResult={matchResult}>
          {usePhotos && <MatchResultPhotos />}
          <MatchResultPlayers />
          <Separator />
          <MatchResultSocials className={styles.Socials} />
          <Separator />
          <div className={styles.Footer}>
            <Timestamp date={new Date(matchResult.playedAt)} className={styles.Timestamp} />
            <MatchResultContextMenu />
            <Button
              icon={<ChevronRight />}
              iconPosition="end"
              text="Details"
              onClick={handleClickDetails}
            />
          </div>
        </MatchResultProvider>
      ) : (
        <Spinner />
      )}
    </div>
  );
};
