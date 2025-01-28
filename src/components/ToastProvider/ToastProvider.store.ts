import { Store } from '@tanstack/store';

interface ToastItem {
  description: string;
  severity: ToastSeverity;
  title: string;
}

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