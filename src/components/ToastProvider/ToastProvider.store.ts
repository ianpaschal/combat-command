import { Store } from '@tanstack/store';

interface ToastItem {
  description?: string | string[];
  icon?: JSX.Element;
  severity: ToastSeverity;
  title: string;
}

type ToastOptions = Omit<ToastItem, 'title' | 'severity'>;

export enum ToastSeverity {
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Success = 'success',
}

export const store = new Store<ToastItem | null>(null);

export const setToast = (toast: ToastItem): void => {
  store.setState(() => toast);
};

export const clearToast = (): void => {
  store.setState(() => null);
};

export const toast = {
  success: (title: string, options: ToastOptions = {}) => setToast({
    title,
    severity: ToastSeverity.Success,
    ...options,
  }),
  info: (title: string, options: ToastOptions = {}) => setToast({
    title,
    severity: ToastSeverity.Info,
    ...options,
  }),
  warning: (title: string, options: ToastOptions = {}) => setToast({
    title,
    severity: ToastSeverity.Warning,
    ...options,
  }),
  error: (title: string, options: ToastOptions = {}) => setToast({
    title,
    severity: ToastSeverity.Error,
    ...options,
  }),
};
