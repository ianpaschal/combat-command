import { useParams } from 'react-router-dom';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import { useQuery } from 'convex/react';
import { ImagePlus } from 'lucide-react';

import { api, MatchResultId } from '~/api';
import { Button } from '~/components/generic/Button';
import { Card } from '~/components/generic/Card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNextButton,
  CarouselPreviousButton,
} from '~/components/generic/Carousel';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { Separator } from '~/components/generic/Separator';
import { Timestamp } from '~/components/generic/Timestamp';
import { MatchResultPlayers } from '~/components/MatchResultPlayers';
import { MatchResultProvider } from '~/components/MatchResultProvider';
import { MatchResultSocials } from '~/components/MatchResultSocials';
import { PageWrapper } from '~/components/PageWrapper';
import { MIN_WIDTH_DESKTOP } from '~/settings';
import { MatchResultDetails } from './components/MatchResultDetails';

import styles from './MatchResultDetailPage.module.scss';

export const MatchResultDetailPage = (): JSX.Element => {
  const windowWidth = useWindowWidth();
  const params = useParams();
  const matchResultId = params.id!; // Must exist or else how did we get to this route?

  const matchResult = useQuery(api.matchResults.fetchMatchResult.fetchMatchResult, {
    id: matchResultId as MatchResultId,
  });

  const photos = ['foo'];

  const hasPhotos = photos.length > 0;

  // TODO: Use context to prevent drilling of matchResult
  return (
    <PageWrapper showBackButton maxWidth={!hasPhotos ? 688 : undefined} fitToWindow={windowWidth >= MIN_WIDTH_DESKTOP}>
      {matchResult && (
        <MatchResultProvider matchResult={matchResult}>
          <div className={styles.Root} data-photos={hasPhotos}>
            <Card className={styles.Players}>
              <MatchResultPlayers />
            </Card>
            {hasPhotos ? (
              <div className={styles.Photos}>
                <Button className={styles.UploadPhotoButton} round><ImagePlus /></Button>
                <Carousel>
                  <CarouselContent>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <CarouselItem key={index}>
                        <div style={{
                          fontSize: '2.5rem', fontWeight: '600', display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '1.5rem',
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'orange',
                        }}>
                          {index + 1}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPreviousButton />
                  <CarouselNextButton />
                </Carousel>
              </div>
            ) : (
              <div className={styles.PhotosEmpty}>
                Upload
              </div>
            )}
            <Card className={styles.DetailsCard}>
              <MatchResultSocials className={styles.Socials} />
              <Separator />
              <ScrollArea className={styles.DetailsScrollArea}>
                <MatchResultDetails className={styles.Details} />
              </ScrollArea>
              <Separator />
              <div className={styles.DetailsFooter}>
                <Timestamp date={new Date(matchResult.playedAt)} />
              </div>
            </Card>
          </div>
        </MatchResultProvider>
      )}
    </PageWrapper>
  );
};
