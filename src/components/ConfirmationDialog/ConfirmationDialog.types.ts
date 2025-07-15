import { ReactNode } from 'react';

import { ElementIntent } from '~/types/componentLib';

export interface ConfirmationDialogProps {
  children?: ReactNode;
  className?: string;
  description?: ReactNode;
  id: string;
  intent?: ElementIntent;
  onConfirm?: () => void;
  title?: string;
  disabled?: boolean;
  disablePadding?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
}

export type ConfirmationDialogData = Partial<ConfirmationDialogProps>;
