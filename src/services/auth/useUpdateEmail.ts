import { useMutation } from '@tanstack/react-query';

import { ChangeEmailFormData } from '~/components/ChangeEmailDialog';
import { setToast, ToastSeverity } from '~/components/ToastProvider';
import { handleError } from '~/services/handleError';
import { supabase } from '~/supabaseClient';

const updateEmail = async ({ email }: ChangeEmailFormData): Promise<void> => {
  const { error } = await supabase.auth.updateUser({ email }, { emailRedirectTo: window.location.href });
  if (error) {
    throw error;
  }
};

export const useUpdateEmail = () => useMutation({
  mutationFn: updateEmail,
  onSuccess: (_data) => {
    setToast({
      title: 'Check your email',
      description: 'A link has been sent to your new email address to confirm.',
      severity: ToastSeverity.Info,
    });
  },
  onError: handleError,
});