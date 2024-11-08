import { useMutation } from '@tanstack/react-query';

import { ChangePasswordFormInput } from '~/components/ChangePasswordDialog/ChangePasswordDialog';
import { supabase } from '~/supabaseClient';

const updatePassword = async ({ password }: ChangePasswordFormInput): Promise<void> => {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    throw new Error(error.message); // Throw the error to trigger onError
  }
};

export const useUpdatePassword = () => useMutation({
  mutationFn: updatePassword,
  onError: (error) => {
    console.error('Error updating password:', error);
  },
});