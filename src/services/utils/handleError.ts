import { ConvexError } from 'convex/values';

import { toast } from '~/components/ToastProvider';

export const handleError = (error: unknown): void => {
  if (error instanceof ConvexError) {
    toast.error('Error', { description: error.data.message });
  } else if (error instanceof Error) {
    toast.error('Error', { description: error.message as string });
  }
};
