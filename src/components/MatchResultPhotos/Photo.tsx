import { PhotoId } from '~/api';
import { useGetPhoto } from '~/services/photos';

import styles from './Photo.module.scss';

export interface PhotoProps {
  id: PhotoId;
}

export const Photo = ({
  id,
}: PhotoProps) => {
  const { data } = useGetPhoto({ id });
  return (
    <div
      className={styles.Photo}
      style={data?.url ? { backgroundImage: `url(${data.url})` } : undefined}
    />
  );
};
