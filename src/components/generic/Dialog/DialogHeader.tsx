import { Close, Title } from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { X } from 'lucide-react';

import styles from './DialogHeader.module.scss';

export interface DialogHeaderProps {
  className?: string;
  preventCancel?: boolean;
  title: string;
  onCancel?: () => void;
}

export const DialogHeader = ({
  className,
  preventCancel = false,
  title,
  onCancel,
}: DialogHeaderProps): JSX.Element => (
  <div className={clsx(styles.DialogHeader, className)}>
    <Title>
      {title}
    </Title>
    {!preventCancel && (
      <Close className={styles.Close} onClick={onCancel}>
        <X />
      </Close>
    )}
  </div>
);
