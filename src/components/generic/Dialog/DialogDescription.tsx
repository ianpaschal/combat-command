import { ReactNode } from 'react';
import { Description } from '@radix-ui/react-dialog';
import clsx from 'clsx';

import styles from './DialogDescription.module.scss';

export interface DialogDescriptionProps {
  className?: string;
  children: ReactNode;
}

export const DialogDescription = ({
  className,
  children,
}: DialogDescriptionProps): JSX.Element => (
  <Description className={clsx(styles.DialogDescription, className)}>
    {children}
  </Description>
);
