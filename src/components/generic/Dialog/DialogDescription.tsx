import { ReactNode } from 'react';
import clsx from 'clsx';
import { Dialog } from 'radix-ui';

import styles from './DialogDescription.module.scss';

export interface DialogDescriptionProps {
  className?: string;
  children: ReactNode;
}

export const DialogDescription = ({
  className,
  children,
}: DialogDescriptionProps): JSX.Element => (
  <Dialog.Description className={clsx(styles.DialogDescription, className)}>
    {children}
  </Dialog.Description>
);
