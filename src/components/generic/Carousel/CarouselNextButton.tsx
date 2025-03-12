import { ComponentProps, forwardRef } from 'react';
import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';

import { Button } from '~/components/generic/Button';
import { useCarousel } from './Carousel.hooks';

import styles from './CarouselNextButton.module.scss';

export const CarouselNextButton = forwardRef<HTMLButtonElement, ComponentProps<typeof Button>>(({
  className,
  ...props
}, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return (
    <Button
      className={clsx(styles.CarouselNextButton, className)}
      data-orientation={orientation}
      disabled={!canScrollNext}
      onClick={scrollNext}
      ref={ref}
      round
      size="large"
      variant="ghost"
      {...props}
    >
      <ArrowRight />
    </Button>
  );
});
