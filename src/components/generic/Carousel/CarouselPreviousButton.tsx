import { ComponentProps, forwardRef } from 'react';
import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';

import { Animate } from '~/components/generic/Animate';
import { Button } from '~/components/generic/Button';
import { useCarousel } from './Carousel.hooks';

import styles from './CarouselPreviousButton.module.scss';

export const CarouselPreviousButton = forwardRef<HTMLButtonElement, ComponentProps<typeof Button>>(({
  className,
  ...props
}, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  return (
    <Animate show={canScrollPrev}>
      <Button
        ref={ref}
        className={clsx(styles.CarouselPreviousButton, className)}
        data-orientation={orientation}
        icon={<ArrowLeft />}
        rounded
        size="large"
        variant="primary"
        onClick={scrollPrev}
        {...props}
      />
    </Animate>
  );
});
