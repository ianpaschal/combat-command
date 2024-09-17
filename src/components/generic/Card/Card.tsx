import { HTMLAttributes } from 'react';
import clsx from 'clsx';

import './Card.scss';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  disablePadding?: boolean;
  description?: string;
}

export const Card = ({
  children,
  disablePadding = false,
  title,
  description,
  className,
  ...props
}: CardProps): JSX.Element => {
  const hasHeader = title || description;
  return (
    <div className={clsx('Card', { 'Card-noPadding': disablePadding, 'Card-hasHeader': hasHeader }, className)} {...props}>
      {hasHeader && (
        <div className="CardHeader">
          {title && (
            <h2>{title}</h2>
          )}
          {description && (
            <p className="CardDescription">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};