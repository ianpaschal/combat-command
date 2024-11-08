import { useMutation } from '@tanstack/react-query';

import { ChangeEmailFormInput } from '~/components/ChangeEmailDialog/ChangeEmailDialog';
import { supabase } from '~/supabaseClient';

const updateEmail = async ({ email }: ChangeEmailFormInput): Promise<void> => {
  const { error } = await supabase.auth.updateUser({ email });
  if (error) {
    throw new Error(error.message); // Throw the error to trigger onError
  }
};

export const useUpdateEmail = () => useMutation({
  mutationFn: updateEmail,
  onError: (error) => {
    console.error('Error updating email:', error);
  },
});