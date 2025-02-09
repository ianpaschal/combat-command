import { useMutation, useQueryClient } from '@tanstack/react-query';

import { setToast, ToastSeverity } from '~/components/ToastProvider';
import { handleError } from '~/services/handleError';
import { supabase } from '~/supabaseClient';
import { UserProfileSecureRow } from '~/types/db';

const updateUserProfile = async ({ userId, data }: { userId: string, data: Partial<UserProfileSecureRow> }) => {
  const { error } = await supabase
    .from('user_profiles')
    .update(data)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (_data, variables) => {
      setToast({
        title: 'Success!',
        description: 'User profile updated.',
        severity: ToastSeverity.Success,
      });
      queryClient.invalidateQueries({ queryKey: ['user_profile', variables.userId] });
    },
    onError: handleError,
  });
};