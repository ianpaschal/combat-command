import { HTMLAttributes } from 'react';
import clsx from 'clsx';

import { createCn } from '~/utils/createCn';

import './Card.scss';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  disablePadding?: boolean;
  description?: string;
  intent?: 'danger' | 'success';
}

const cn = createCn('Card');

export const Card = ({
  children,
  disablePadding = false,
  title,
  description,
  intent,
  className,
  ...props
}: CardProps): JSX.Element => {
  const hasHeader = title || description;
  return (
    <div className={clsx(cn(), intent && cn(`--${intent}`), className)} {...props}>
      {hasHeader && (
        <div className={clsx(cn('__Header'), intent && cn(`__Header--${intent}`))}>
          {title && (
            <h2>{title}</h2>
          )}
          {description && (
            <p className={cn('__Description')}>{description}</p>
          )}
        </div>
      )}
      <div
        className={clsx(cn('__Body'), {
          [`${cn('__Body')}--noPadding`]: disablePadding,
          [`${cn('__Body')}--hasHeader`]: hasHeader,
        })}
      >
        {children}
      </div>

    </div>
  );
};