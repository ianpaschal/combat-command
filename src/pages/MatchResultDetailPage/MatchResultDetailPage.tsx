import { useParams } from 'react-router-dom';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import { ImagePlus } from 'lucide-react';

import { MatchResultId } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { FowV4MatchResultDetails } from '~/components/FowV4MatchResultDetails';
import { Button } from '~/components/generic/Button';
import { Card } from '~/components/generic/Card';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { Separator } from '~/components/generic/Separator';
import { Timestamp } from '~/components/generic/Timestamp';
import { MatchResultPhotos } from '~/components/MatchResultPhotos';
import { MatchResultPhotoUploadDialog, useMatchResultPhotoUploadDialog } from '~/components/MatchResultPhotoUploadDialog';
import { MatchResultPlayers } from '~/components/MatchResultPlayers';
import { MatchResultProvider } from '~/components/MatchResultProvider';
import { MatchResultSocials } from '~/components/MatchResultSocials';
import { PageWrapper } from '~/components/PageWrapper';
import { useGetMatchResult } from '~/services/matchResults';
import { MIN_WIDTH_DESKTOP } from '~/settings';

import styles from './MatchResultDetailPage.module.scss';

export const MatchResultDetailPage = (): JSX.Element => {
  const user = useAuth();
  const windowWidth = useWindowWidth();
  const params = useParams();
  const matchResultId = params.id! as MatchResultId; // Must exist or else how did we get to this route?
  const { open } = useMatchResultPhotoUploadDialog(matchResultId);

  const { data: matchResult } = useGetMatchResult({ id: matchResultId });

  const hasPhotos = !!matchResult?.photoIds?.length;
  const userInMatch = matchResult && user && [
    matchResult.player0UserId,
    matchResult.player1UserId,
  ].includes(user._id);
  const fitToWindow = hasPhotos && windowWidth >= MIN_WIDTH_DESKTOP;

  return (
    <PageWrapper showBackButton maxWidth={!hasPhotos ? 688 : undefined} fitToWindow={fitToWindow}>
      {matchResult && (
        <MatchResultProvider matchResult={matchResult}>
          <div className={styles.Root} data-photos={hasPhotos}>
            <Card className={styles.Players}>
              <MatchResultPlayers />
            </Card>
            {hasPhotos && (
              <MatchResultPhotos className={styles.Photos} />
            )}
            {!hasPhotos && userInMatch && (
              <Button className={styles.PhotosEmpty} variant="ghost" onClick={open}>
                <ImagePlus />
                Add Photos
              </Button>
            )}
            <Card className={styles.DetailsCard}>
              <MatchResultSocials className={styles.Socials} />
              <Separator />
              <ScrollArea className={styles.DetailsScrollArea}>
                <FowV4MatchResultDetails
                  className={styles.Details}
                  matchResult={matchResult}
                />
              </ScrollArea>
              <Separator />
              <div className={styles.DetailsFooter}>
                <Timestamp date={new Date(matchResult.playedAt)} />
              </div>
            </Card>
          </div>
          <MatchResultPhotoUploadDialog />
        </MatchResultProvider>
      )}
    </PageWrapper>
  );
};
