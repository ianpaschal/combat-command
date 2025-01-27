import {
  ElementRef,
  forwardRef,
  HTMLAttributes,
  RefObject,
} from 'react';
import clsx from 'clsx';

import { createCn } from '~/utils/componentLib/createCn';

import './Card.scss';

type CardRef = ElementRef<'div'>;

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  disablePadding?: boolean;
  description?: string;
  intent?: 'danger' | 'success';
  subClassNames?: {
    body?: string;
  }
}

const cn = createCn('Card');

export const Card = forwardRef<CardRef, CardProps>(({
  children,
  disablePadding = false,
  title,
  description,
  intent,
  className,
  subClassNames = {},
  ...props
}, ref): JSX.Element => {
  const hasHeader = title || description;
  return (
    <div className={clsx(cn(), intent && cn(`-${intent}`), className)} ref={ref} {...props}>
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
        className={clsx(cn('_Body'), subClassNames?.body, {
          [`${cn('_Body')}-noPadding`]: disablePadding,
          [`${cn('_Body')}-hasHeader`]: hasHeader,
        })}
      >
        {children}
      </div>
    </div>
  );
});