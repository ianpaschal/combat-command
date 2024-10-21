import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '~/supabaseClient';
import { UserProfile } from '~/types/UserProfile';

const updateUserProfile = async ({ id, data }: { id: string, data: UserProfile }) => {
  const { data: response, error } = await supabase
    .from('user_profiles')
    .update(data)
    .eq('id', id);

  if (error) {
    throw error;
  }
  return response;
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    // onMutate: async ({ userId, profileData }) => {
    //   await queryClient.cancelQueries({ queryKey: ['userProfile', userId] });

    //   const previousProfile = queryClient.getQueryData(['userProfile', userId]);

    //   queryClient.setQueryData(['userProfile', userId], (old: UserProfile) => ({
    //     ...old,
    //     ...profileData,
    //   }));

    //   return { previousProfile };
    // },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.id] });
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
    },
  });
};