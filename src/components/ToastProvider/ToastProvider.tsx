import { cloneElement, ReactNode } from 'react';
import * as Toast from '@radix-ui/react-toast';
import { useStore } from '@tanstack/react-store';
import clsx from 'clsx';
import {
  CircleCheck,
  Info,
  OctagonAlert,
  TriangleAlert,
} from 'lucide-react';

import {
  clearToast,
  store,
  ToastSeverity,
} from './ToastProvider.store';

import styles from './ToastProvider.module.scss';

const severityIcons: Record<ToastSeverity, JSX.Element> = {
  [ToastSeverity.Error]: <OctagonAlert />,
  [ToastSeverity.Warning]: <TriangleAlert />,
  [ToastSeverity.Success]: <CircleCheck />,
  [ToastSeverity.Info]: <Info />,
};

const severityClasses: Record<ToastSeverity, string> = {
  [ToastSeverity.Error]: styles.SeverityError,
  [ToastSeverity.Warning]: styles.SeverityWarning,
  [ToastSeverity.Success]: styles.SeveritySuccess,
  [ToastSeverity.Info]: styles.SeverityInfo,
};

const severityDurations: Record<ToastSeverity, number> = {
  [ToastSeverity.Error]: 5000,
  [ToastSeverity.Warning]: 3000,
  [ToastSeverity.Success]: 2000,
  [ToastSeverity.Info]: 5000,
};

export interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({
  children,
}: ToastProviderProps): JSX.Element => {
  const toast = useStore(store, (state) => state);

  const handleOpenChange = (isOpen: boolean): void => {
    if (!isOpen) {
      clearToast();
    }
  };

  const icon = toast ? toast.icon || severityIcons[toast.severity] : null;

  return (
    <Toast.Provider swipeDirection="up">
      {children}
      {toast && (
        <Toast.Root
          className={styles.Root}
          open={!!toast}
          onOpenChange={handleOpenChange}
          duration={severityDurations[toast?.severity]}
        >
          {icon ? cloneElement(icon, {
            className: clsx(styles.Icon, severityClasses[toast.severity]),
          }) : null}
          <Toast.Title className={styles.Title}>
            {toast.title}
          </Toast.Title>
          {toast.description && (
            <Toast.Description className={styles.Description}>
              {toast.description}
            </Toast.Description>
          )}
        </Toast.Root>
      )}
      <Toast.Viewport className={styles.Viewport} />
    </Toast.Provider>
  );
};
