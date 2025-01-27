import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '~/supabaseClient';
import { UserProfileSecureRow } from '~/types/db';
import { NullConversion } from '~/utils/nullsToUndefined';

export interface DeleteAvatarInput {
  userProfile: NullConversion<UserProfileSecureRow>;
}

const deleteAvatar = async ({ userProfile }: DeleteAvatarInput): Promise<void> => {
  
  if (userProfile.avatar_url) {
    console.log('will delete', userProfile.avatar_url);
    const { error: profileUpdateError } = await supabase
      .from('user_profiles')
      .update({ avatar_url: null })
      .eq('user_id', userProfile.user_id);

    if (profileUpdateError) {
      throw profileUpdateError;
    }

    const { error: deleteAvatarError } = await supabase.storage.from('avatars').remove([userProfile.avatar_url]);
    if (deleteAvatarError) {
      throw deleteAvatarError;
    }
  }
};

export const useDeleteAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAvatar,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user_profile', variables.userProfile.user_id] });
    },
    onError: (error) => {
      console.error('Error deleting avatar:', error);
    },
  });
};