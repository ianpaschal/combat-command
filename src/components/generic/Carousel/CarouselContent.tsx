import { forwardRef, HTMLAttributes } from 'react';
import clsx from 'clsx';

import { useCarousel } from './Carousel.hooks';

import styles from './CarouselContent.module.scss';

export const CarouselContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({
  className,
  ...props
}, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className={clsx(styles.CarouselContent, className)}>
      <div
        ref={ref}
        className={styles.CarouselContentInner}
        data-orientation={orientation}
        {...props}
      />
    </div>
  );
});
