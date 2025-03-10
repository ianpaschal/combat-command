import { forwardRef } from 'react';
import clsx from 'clsx';
import { MapPin } from 'lucide-react';

import { Button, ButtonProps } from '~/components/generic/Button';

import styles from './InputLocation.module.scss';

export interface LocationButtonProps extends ButtonProps {
  place?: {
    mapbox_id: string;
    name: string;
    place_formatted: string;
  }
  placeholder?: string;
}

export const LocationButton = forwardRef<HTMLButtonElement, LocationButtonProps>(({
  place,
  className,
  placeholder,
  ...props
}, ref): JSX.Element => (
  <Button ref={ref} className={clsx(styles.Location, className)} variant="outlined" {...props}>
    <MapPin className={styles.LocationIcon} />
    {place && (
      <>
        <div className={styles.LocationName}>{place?.name}</div>
        <div className={styles.LocationAddress}>{place?.place_formatted}</div>
      </>
    )}
    {!place && placeholder && (
      <div className={styles.LocationPlaceholder}>{placeholder}</div>
    )}
  </Button>
));
