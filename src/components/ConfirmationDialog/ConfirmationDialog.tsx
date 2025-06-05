import { ReactNode } from 'react';
import clsx from 'clsx';
import { TriangleAlert } from 'lucide-react';

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
  warnings?: ReactNode[];
}

export const ConfirmationDialog = ({
  children,
  className,
  description,
  id,
  intent = 'danger',
  onConfirm,
  title,
  warnings = [],
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
      <DialogHeader title={title} onCancel={close} />
      <ScrollArea>
        {description && (
          <DialogDescription>
            {description}
          </DialogDescription>
        )}
        {warnings.length > 0 && (
          <div className={styles.ConfirmationDialog_WarningsList}>
            {warnings.map((warning, i) => (
              <div key={i} className={styles.ConfirmationDialog_WarningBlurb}>
                <TriangleAlert className={styles.ConfirmationDialog_WarningBlurb_Icon} />
                <h3 className={styles.ConfirmationDialog_WarningBlurb_Header}>
                  Warning
                </h3>
                <div className={styles.ConfirmationDialog_WarningBlurb_Body}>
                  {warning}
                </div>
              </div>
            ))}
          </div>
        )}
        {children && (
          <div className={styles.ConfirmationDialog_Children}>
            {children}
          </div>
        )}
      </ScrollArea>
      <DialogActions>
        <Button variant="secondary" onClick={close}>
          Cancel
        </Button>
        <Button intent={intent} onClick={handleConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </ControlledDialog>
  );
};
