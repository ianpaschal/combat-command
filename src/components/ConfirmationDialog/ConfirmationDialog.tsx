import { ReactNode } from 'react';
import clsx from 'clsx';

import { Button } from '~/components/generic/Button';
import {
  ControlledDialog,
  DialogActions,
  DialogDescription,
  DialogHeader,
} from '~/components/generic/Dialog';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { ElementIntent } from '~/types/componentLib';
import { useConfirmationDialog } from './ConfirmationDialog.hooks';

import styles from './ConfirmationDialog.module.scss';

export interface ConfirmationDialogProps {
  children?: ReactNode;
  className?: string;
  description?: string;
  id: string;
  intent?: ElementIntent;
  onConfirm?: () => void;
  title: string;
  disabled?: boolean;
  disablePadding?: boolean;
}

export const ConfirmationDialog = ({
  children,
  className,
  description,
  id,
  intent = 'default',
  onConfirm,
  title,
  disabled = false,
  disablePadding = false,
}: ConfirmationDialogProps): JSX.Element => {
  const { close, data } = useConfirmationDialog(id);
  const handleConfirm = (): void => {
    if (data?.onConfirm) {
      data.onConfirm();
    }
    if (onConfirm) {
      onConfirm();
    }
    close();
  };
  return (
    <ControlledDialog id={id} width="small" className={clsx(className)}>
      <DialogHeader title={data?.title ?? title} onCancel={close} />
      <ScrollArea>
        {(data?.description || description) && (
          <DialogDescription>
            {data?.description || description}
          </DialogDescription>
        )}
        <div className={styles.ConfirmationDialog_Body} data-padding={!disablePadding}>
          {children}
        </div>
      </ScrollArea>
      <DialogActions>
        <Button variant="secondary" onClick={close}>
          Cancel
        </Button>
        <Button intent={intent} onClick={handleConfirm} disabled={disabled}>
          Confirm
        </Button>
      </DialogActions>
    </ControlledDialog>
  );
};
