import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '~/supabaseClient';
import { UserProfileSecureRow } from '~/types/db';

const updateUserProfile = async ({ userId, data }: { userId: string, data: Partial<UserProfileSecureRow> }) => {
  const { data: response, error } = await supabase
    .from('user_profiles')
    .update(data)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
  return response;
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user_profile', variables.userId] });
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
    },
  });
};