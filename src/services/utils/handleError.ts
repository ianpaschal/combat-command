import { toast } from '~/components/ToastProvider';

export const handleError = (error: Error): void => {
  toast.error(error.name, { description: error.message });
  console.error(error);
};
