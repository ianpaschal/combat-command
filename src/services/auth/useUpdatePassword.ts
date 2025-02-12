import { useMutation } from '@tanstack/react-query';

import { ChangePasswordFormData } from '~/components/ChangePasswordDialog';
import { toast } from '~/components/ToastProvider';
import { handleError } from '~/services/handleError';
import { supabase } from '~/supabaseClient';

const updatePassword = async ({ password }: ChangePasswordFormData): Promise<void> => {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    throw error;
  }
};

export const useUpdatePassword = () => useMutation({
  mutationFn: updatePassword,
  onSuccess: (_data) => {
    toast.success('Password updated.');
  },
  onError: handleError,
});