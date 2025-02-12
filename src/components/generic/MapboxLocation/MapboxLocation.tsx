import clsx from 'clsx';

import { useRetrieveLocation } from '~/services/mapbox/useRetrieveLocation';

import styles from './MapboxLocation.module.scss';

export interface MapboxLocationProps {
  id?: string;
  className?: string;
  loading?: boolean;
}

export const MapboxLocation = ({
  id,
  className,
  loading = false,
}: MapboxLocationProps): JSX.Element => {

  const { data: location } = useRetrieveLocation(id);

  return (
    <div className={clsx(styles.Root, className)}>
      {location && (
        <>
          <div className={styles.Name}>{location.properties.name}</div>
          <div className={styles.Address}>{location.properties.place_formatted}</div>
        </>
      )}
    </div>
  );
};