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
        ref={ref}
        className={clsx(styles.CarouselNextButton, className)}
        data-orientation={orientation}
        icon={<ArrowRight />}
        round
        size="large"
        variant="primary"
        onClick={scrollNext}
        {...props}
      />
    </Animate>
  );
});
