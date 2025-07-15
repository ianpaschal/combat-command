import clsx from 'clsx';

import { ConfirmationDialogProps } from '~/components/ConfirmationDialog/ConfirmationDialog.types';
import { Button } from '~/components/generic/Button';
import {
  ControlledDialog,
  DialogActions,
  DialogDescription,
  DialogHeader,
} from '~/components/generic/Dialog';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { useConfirmationDialog } from './ConfirmationDialog.hooks';

import styles from './ConfirmationDialog.module.scss';

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
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
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
      <DialogHeader title={data?.title ?? title ?? 'Confirmation'} onCancel={close} />
      <ScrollArea>
        {(data?.description || description) && (
          <DialogDescription>
            {data?.description || description}
          </DialogDescription>
        )}
        <div className={styles.ConfirmationDialog_Body} data-padding={!disablePadding}>
          {data?.children}
          {children}
        </div>
      </ScrollArea>
      <DialogActions>
        <Button variant="secondary" onClick={close}>
          {data?.cancelLabel ?? cancelLabel}
        </Button>
        <Button intent={intent} onClick={handleConfirm} disabled={disabled}>
          {data?.confirmLabel ?? confirmLabel}
        </Button>
      </DialogActions>
    </ControlledDialog>
  );
};
