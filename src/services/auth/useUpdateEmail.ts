import { useMutation } from '@tanstack/react-query';

import { ChangeEmailFormData } from '~/components/ChangeEmailDialog';
import { toast } from '~/components/ToastProvider';
import { handleError } from '~/services/handleError';

export const useUpdateEmail = () => useMutation({
  mutationFn: async ({ email: _email }: ChangeEmailFormData): Promise<void> => {
    // TODO: Implement Convex email update
  },
  onSuccess: () => toast.info('Check your email', {
    description: 'A link has been sent to your new email address to confirm.',
  }),
  onError: handleError,
});
