import { ComponentProps, forwardRef } from 'react';
import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';

import { Animate } from '~/components/generic/Animate';
import { Button } from '~/components/generic/Button';

import { useCarousel } from './Carousel.hooks';

import styles from './CarouselNextButton.module.scss';

export const CarouselNextButton = forwardRef<HTMLButtonElement, ComponentProps<typeof Button>>(({
  className,
  ...props
}, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return (
    <Animate show={canScrollNext}>
      <Button
        className={clsx(styles.CarouselNextButton, className)}
        data-orientation={orientation}
        onClick={scrollNext}
        ref={ref}
        round
        size="large"
        variant="primary"
        {...props}
      >
        <ArrowRight />
      </Button>
    </Animate>
  );
});
