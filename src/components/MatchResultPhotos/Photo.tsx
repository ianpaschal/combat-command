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
    <div className={styles.Photo}>
      {data?.url && (
        <img className={styles.Image} src={data.url} />
      )}
    </div>
  );
};
