import { HTMLAttributes } from 'react';
import clsx from 'clsx';

import './DrawerBody.scss';

export interface DrawerBodyProps extends HTMLAttributes<HTMLDivElement> {
  side?: 'left' | 'right' | 'top' | 'bottom';
}

export const DrawerBody = ({
  className,
  children,
  ...props
}: DrawerBodyProps): JSX.Element => (
  <div className={clsx('DrawerBody', className)} {...props}>
    {children}
  </div>
);
