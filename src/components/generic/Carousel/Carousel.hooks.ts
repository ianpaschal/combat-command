import { useContext } from 'react';

import { CarouselContext } from './Carousel.context';

export const useCarousel = () => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw Error('useCarousel must be used within a <Carousel />!');
  }
  return context;
};
