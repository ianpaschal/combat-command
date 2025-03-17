import clsx from 'clsx';
import { ImagePlus } from 'lucide-react';

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
  const matchResult = useMatchResult();
  const { photoIds } = useMatchResult();
  const { open: openUploadPhotoDialog } = useMatchResultPhotoUploadDialog(matchResult._id);
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
        <CarouselPreviousButton />
        <CarouselNextButton />
      </Carousel>
      <Button className={styles.UploadPhotoButton} round onClick={openUploadPhotoDialog}>
        <ImagePlus />
      </Button>
    </div>
  );
};
