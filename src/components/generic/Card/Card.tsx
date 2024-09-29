import { HTMLAttributes } from 'react';
import clsx from 'clsx';

import { createCn } from '~/utils/componentLib/createCn';

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
    <div className={clsx(cn(), intent && cn(`-${intent}`), className)} {...props}>
      {hasHeader && (
        <div className={clsx(cn('_Header'), intent && cn(`_Header-${intent}`))}>
          {title && (
            <h2>{title}</h2>
          )}
          {description && (
            <p className={cn('_Description')}>{description}</p>
          )}
        </div>
      )}
      <div
        className={clsx(cn('_Body'), {
          [`${cn('_Body')}-noPadding`]: disablePadding,
          [`${cn('_Body')}-hasHeader`]: hasHeader,
        })}
      >
        {children}
      </div>
    </div>
  );
};