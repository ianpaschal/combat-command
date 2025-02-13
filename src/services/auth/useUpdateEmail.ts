import { useMutation } from '@tanstack/react-query';

import { ChangeEmailFormData } from '~/components/ChangeEmailDialog';
import { toast } from '~/components/ToastProvider';
import { handleError } from '~/services/handleError';
import { supabase } from '~/supabaseClient';

export const useUpdateEmail = () => useMutation({
  mutationFn: async ({ email }: ChangeEmailFormData): Promise<void> => {
    const { error } = await supabase.auth.updateUser({ email }, {
      emailRedirectTo: window.location.href,
    });
    if (error) {
      throw error;
    }
  },
  onSuccess: () => toast.info('Check your email', {
    description: 'A link has been sent to your new email address to confirm.',
  }),
  onError: handleError,
});