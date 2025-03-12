import { ComponentProps, forwardRef } from 'react';
import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';

import { Button } from '~/components/generic/Button';
import { useCarousel } from './Carousel.hooks';

import styles from './CarouselPreviousButton.module.scss';

export const CarouselPreviousButton = forwardRef<HTMLButtonElement, ComponentProps<typeof Button>>(({
  className,
  ...props
}, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  return (
    <Button
      className={clsx(styles.CarouselPreviousButton, className)}
      data-orientation={orientation}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      ref={ref}
      round
      size="large"
      variant="ghost"
      {...props}
    >
      <ArrowLeft />
    </Button>
  );
});
