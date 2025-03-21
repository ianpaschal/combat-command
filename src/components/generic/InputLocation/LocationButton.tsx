import { forwardRef } from 'react';
import clsx from 'clsx';
import { MapPin } from 'lucide-react';

import { ButtonProps } from '~/components/generic/Button';

import styles from './LocationButton.module.scss';

export interface LocationButtonProps extends ButtonProps {
  place?: {
    name: string;
    placeFormatted: string;
  }
  placeholder?: string;
}

export const LocationButton = forwardRef<HTMLButtonElement, LocationButtonProps>(({
  place,
  className,
  placeholder,
  ...props
}, ref): JSX.Element => (
  <button ref={ref} className={clsx(styles.LocationButton, className)} {...props}>
    <MapPin className={styles.LocationButton_Icon} />
    <div className={styles.LocationButton_Body}>
      {place && (
        <>
          <div className={styles.LocationButton_Name}>{place?.name}</div>
          <div className={styles.LocationButton_Place}>{place?.placeFormatted}</div>
        </>
      )}
      {!place && placeholder && (
        <div className={styles.LocationButton_Placeholder}>{placeholder}</div>
      )}
    </div>
  </button>
));
