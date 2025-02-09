import { setToast, ToastSeverity } from '~/components/ToastProvider';

export const handleError = (error: Error): void => {
  setToast({
    title: error.name,
    description: error.message,
    severity: ToastSeverity.Error,
  });
  console.error(error);
};