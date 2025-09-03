import { MouseEvent } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { Dialog } from 'radix-ui';

import styles from './DialogHeader.module.scss';

export interface DialogHeaderProps {
  className?: string;
  canCancel?: boolean;
  title: string;
  onCancel?: (e: MouseEvent) => void;
}

export const DialogHeader = ({
  className,
  canCancel = true,
  title,
  onCancel,
}: DialogHeaderProps): JSX.Element => (
  <div className={clsx(styles.DialogHeader, className)}>
    <Dialog.Title>
      {title}
    </Dialog.Title>
    {canCancel && (
      <Dialog.Close className={styles.Close} onClick={onCancel}>
        <X />
      </Dialog.Close>
    )}
  </div>
);
