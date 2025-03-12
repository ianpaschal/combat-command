import { forwardRef, HTMLAttributes } from 'react';
import clsx from 'clsx';

import styles from './CarouselItem.module.scss';

export const CarouselItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({
  className,
  ...props
}, ref) => (
  <div
    aria-roledescription="slide"
    className={clsx(styles.CarouselItem, className)}
    ref={ref}
    role="group"
    {...props}
  />
));
