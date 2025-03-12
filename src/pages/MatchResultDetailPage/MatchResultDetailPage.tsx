import { useParams } from 'react-router-dom';
import { useQuery } from 'convex/react';

import { api, MatchResultId } from '~/api';
import { Card } from '~/components/generic/Card';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { Separator } from '~/components/generic/Separator';
import { Timestamp } from '~/components/generic/Timestamp';
import { MatchResultPlayers } from '~/components/MatchResultPlayers';
import { MatchResultSocials } from '~/components/MatchResultSocials';
import { PageWrapper } from '~/components/PageWrapper';
import { MatchResultDetails } from './components/MatchResultDetails';

import styles from './MatchResultDetailPage.module.scss';

export const MatchResultDetailPage = (): JSX.Element => {
  const params = useParams();
  const matchResultId = params.id!; // Must exist or else how did we get to this route?

  const matchResult = useQuery(api.matchResults.fetchMatchResult.fetchMatchResult, {
    id: matchResultId as MatchResultId,
  });

  const photos = [];

  const hasPhotos = photos.length > 0;

  // TODO: Use context to prevent drilling of matchResult
  return (
    <PageWrapper showBackButton maxWidth={!hasPhotos ? 688 : undefined} fitToWindow={hasPhotos}>
      {matchResult && (
        <div className={styles.Root} data-hasPhotos={hasPhotos}>
          <Card className={styles.Players}>
            <MatchResultPlayers matchResult={matchResult} />
          </Card>
          {hasPhotos ? (
            <div className={styles.Photos}>
              Photos go here
            </div>
          ) : (
            <div className={styles.PhotosEmpty}>
              Upload
            </div>
          )}
          <Card className={styles.DetailsCard}>
            <MatchResultSocials className={styles.Socials} matchResult={matchResult} />
            <Separator />
            <ScrollArea className={styles.DetailsScrollArea}>
              <MatchResultDetails matchResult={matchResult} className={styles.Details} />
            </ScrollArea>
            <Separator />
            <div className={styles.DetailsFooter}>
              <Timestamp date={new Date(matchResult.playedAt)} />
            </div>
          </Card>
        </div>
      )}
    </PageWrapper>
  );
};
