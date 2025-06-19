import { PhotoId } from '~/api';
import { useFetchPhoto } from '~/services/photos/useFetchPhoto';

import styles from './Photo.module.scss';

export interface PhotoProps {
  id: PhotoId;
}

export const Photo = ({
  id,
}: PhotoProps) => {
  const { data } = useFetchPhoto(id);
  return (
    <div
      className={styles.Photo}
      style={data?.url ? { backgroundImage: `url(${data.url})` } : undefined}
    />
  );
};
