import clsx from 'clsx';
import { ImagePlus } from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNextButton,
  CarouselPreviousButton,
} from '~/components/generic/Carousel';
import { Photo } from '~/components/MatchResultPhotos/Photo';
import { useMatchResultPhotoUploadDialog } from '~/components/MatchResultPhotoUploadDialog/MatchResultPhotoUploadDialog.hooks';
import { useMatchResult } from '~/components/MatchResultProvider';

import styles from './MatchResultPhotos.module.scss';

export interface MatchResultPhotosProps {
  className?: string;
}

export const MatchResultPhotos = ({
  className,
}: MatchResultPhotosProps): JSX.Element => {
  const user = useAuth();
  const matchResult = useMatchResult();
  const { photoIds } = useMatchResult();
  const { open: openUploadPhotoDialog } = useMatchResultPhotoUploadDialog(matchResult._id);
  const userInMatch = matchResult && user && [
    matchResult.player0UserId,
    matchResult.player1UserId,
  ].includes(user._id);
  return (
    <div className={clsx(styles.MatchResultPhotos, className)}>
      <Carousel>
        <CarouselContent>
          {(photoIds || []).map((id) => (
            <CarouselItem key={id}>
              <Photo id={id} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {(photoIds || []).length > 1 && (
          <>
            <CarouselPreviousButton />
            <CarouselNextButton />
          </>
        )}
      </Carousel>
      {userInMatch && (
        <Button
          className={styles.UploadPhotoButton}
          icon={<ImagePlus />}
          round
          onClick={openUploadPhotoDialog}
        />
      )}
    </div>
  );
};
