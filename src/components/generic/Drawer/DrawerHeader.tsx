import { HTMLAttributes } from 'react';
import { Close, Title } from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import clsx from 'clsx';
import { X } from 'lucide-react';

import './DrawerHeader.scss';

export interface DrawerHeaderProps extends HTMLAttributes<HTMLDivElement> {
  side?: 'left' | 'right' | 'top' | 'bottom';
  border?: boolean;
  hideTitle?: boolean;
  title: string;
}

export const DrawerHeader = ({
  side = 'right',
  className,
  title,
  hideTitle = false,
  border = false,
  children,
  ...props
}: DrawerHeaderProps): JSX.Element => (
  <div className={clsx('DrawerHeader', `DrawerHeader-${side}`, { 'DrawerHeader-border': border }, className)} {...props}>
    {hideTitle ? (
      <VisuallyHidden.Root>
        <Title className={clsx('DrawerTitle', className)}>{title}</Title>
      </VisuallyHidden.Root>
    ) : (
      <Title className={clsx('DrawerTitle', className)}>{title}</Title>
    )}
    {children}
  </div>
);

