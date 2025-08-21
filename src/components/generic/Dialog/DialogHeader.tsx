import { MouseEvent } from 'react';
import { Close, Title } from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { X } from 'lucide-react';

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
    <Title>
      {title}
    </Title>
    {canCancel && (
      <Close className={styles.Close} onClick={onCancel}>
        <X />
      </Close>
    )}
  </div>
);
