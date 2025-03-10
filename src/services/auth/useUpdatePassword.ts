import { useMutation } from '@tanstack/react-query';

import { ChangePasswordFormData } from '~/components/ChangePasswordDialog';
import { toast } from '~/components/ToastProvider';
import { handleError } from '~/services/handleError';

export const useUpdatePassword = () => useMutation({
  mutationFn: async ({ password: _password }: ChangePasswordFormData): Promise<void> => {
    // TODO: Implement Convex password update
  },
  onSuccess: () => toast.success('Password updated.'),
  onError: handleError,
});
