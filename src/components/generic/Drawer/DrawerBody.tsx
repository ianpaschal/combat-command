import { HTMLAttributes } from 'react';
import clsx from 'clsx';

import { ScrollArea } from '~/components/generic/ScrollArea';

import './DrawerBody.scss';

export interface DrawerBodyProps extends HTMLAttributes<HTMLDivElement> {
  side?: 'left' | 'right' | 'top' | 'bottom';
}

export const DrawerBody = ({
  className,
  side,
  children,
  ...props
}: DrawerBodyProps): JSX.Element => (
  <ScrollArea type="scroll">
    <div className={clsx('DrawerBody', `DrawerBody-${side}`, className)} {...props}>
      {children}
    </div>
  </ScrollArea>
);
