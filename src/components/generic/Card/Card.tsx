import { HTMLAttributes } from 'react';
import clsx from 'clsx';

import './Card.scss';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  disablePadding?: boolean;
}

export const Card = ({
  children,
  disablePadding = false,
  className,
  ...props
}: CardProps): JSX.Element => (
  <div className={clsx('Card', { 'Card-noPadding': disablePadding }, className)} {...props}>
    {children}
  </div>
);