import {
  ElementRef,
  forwardRef,
  HTMLAttributes,
} from 'react';
import clsx from 'clsx';

import styles from './Card.module.scss';

type CardRef = ElementRef<'div'>;

export interface CardProps extends HTMLAttributes<HTMLDivElement> { }

export const Card = forwardRef<CardRef, CardProps>(({
  children,
  className,
  ...props
}, ref): JSX.Element => (
  <div className={clsx(styles.Card, className)} ref={ref} {...props}>
    {children}
  </div>
));
